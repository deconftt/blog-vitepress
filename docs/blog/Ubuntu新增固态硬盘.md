# 🧭 Ubuntu 设置2块SSD raid0（ZFS）配置记录

> 本次系统为 Ubuntu 系统，有三块 SSD：
> - 一块为系统盘（例如 Samsung SSD 980）；
> - 另外两块（例如 WD Blue SN5000）用于组成 ZFS 条带池（RAID0）。
>


---

## 🧩 第 1 步：确认磁盘信息

列出所有 NVMe 设备 使用稳定 ID 路径：

```bash
ls -l /dev/disk/by-id/ | grep nvme
```

**预期输出示例：**
```
nvme-Samsung_SSD_980_1TB_S649NX0T474713M -> ../../nvme0n1
nvme-WD_Blue_SN5000_1TB_24518D800633     -> ../../nvme1n1
nvme-WD_Blue_SN5000_1TB_245185800891     -> ../../nvme2n1
```

🟢 确认系统盘为 Samsung（挂载 `/`），不要动。
✅ 另外两块 WD SN5000 为新建 ZFS 池使用。

---

## 🧱 第 2 步：卸载并清空两块数据盘

卸载旧挂载并彻底清空分区表和文件系统签名：

```bash
sudo umount -f /dev/nvme1n1* 2>/dev/null || true
sudo umount -f /dev/nvme2n1* 2>/dev/null || true

sudo wipefs -a /dev/nvme1n1
sudo wipefs -a /dev/nvme2n1
sudo sgdisk --zap-all /dev/nvme1n1
sudo sgdisk --zap-all /dev/nvme2n1
```

验证清空结果：

```bash
sudo blkid | grep nvme
```

**预期输出示例：**
```
/dev/nvme0n1p2: UUID="3c12e749-6f3b-41d3-bdd6-06e9d4704e84" TYPE="ext4"
```
🟢 只看到系统盘 (`nvme0n1`)；`nvme1n1` 和 `nvme2n1` 不再出现，表示清理成功。

---

## ⚙️ 第 3 步：创建 ZFS 条带池（stripe）

安装 ZFS 工具（如未安装）：

```bash
sudo apt update && sudo apt install -y zfsutils-linux
```

创建条带池：

```bash
sudo zpool create -f   -o ashift=12   -o autotrim=on   zfs_pool   /dev/disk/by-id/nvme-WD_Blue_SN5000_1TB_24518D800633   /dev/disk/by-id/nvme-WD_Blue_SN5000_1TB_245185800891
```

验证池状态：

```bash
zpool status
zpool list
```

**预期输出示例：**
```
pool: zfs_pool
 state: ONLINE
config:
  NAME                                    STATE     READ WRITE CKSUM
  zfs_pool                                ONLINE       0     0     0
    nvme-WD_Blue_SN5000_1TB_24518D800633  ONLINE       0     0     0
    nvme-WD_Blue_SN5000_1TB_245185800891  ONLINE       0     0     0

errors: No known data errors

NAME       SIZE  ALLOC   FREE  CKPOINT  EXPANDSZ   FRAG    CAP  DEDUP    HEALTH  ALTROOT
zfs_pool  1.81T   660K  1.81T        -         -     0%     0%  1.00x    ONLINE  -

```

---

## 📁 第 4 步：设置挂载点与属性

创建挂载目录并配置属性：

```bash
sudo mkdir -p /ssd
sudo zfs set mountpoint=/ssd zfs_pool
sudo zfs set compression=lz4 zfs_pool
sudo zfs set dedup=on zfs_pool
sudo zfs set atime=off zfs_pool
sudo zfs set xattr=sa acltype=posixacl zfs_pool
```

验证：

```bash
zfs get mountpoint,dedup,compression zfs_pool
```

**预期输出示例：**
```
NAME      PROPERTY     VALUE          SOURCE
zfs_pool  mountpoint   /ssd           local
zfs_pool  dedup        on             local
zfs_pool  compression  lz4            local
```

---

## 🧮 第 5 步：验证挂载状态

```bash
zfs list
mount | grep zfs
```

**预期输出示例：**
```
zfs_pool  1.81T  680K  1.81T  /ssd
zfs_pool on /ssd type zfs (rw,relatime,xattr,posixacl)
```

---

## 🔁 第 6 步：配置开机自动挂载

启用 ZFS 自动导入与挂载服务：

```bash
sudo systemctl enable zfs-import-cache.service
sudo systemctl enable zfs-mount.service
sudo systemctl enable zfs-import.target
```

导出再导入池以生成缓存：

```bash
sudo zpool export zfs_pool
sudo zpool import zfs_pool
```

验证：

```bash
zpool list
mount | grep /ssd
```

**预期输出：**
```
zfs_pool  1.81T  1.06M  1.81T  /ssd
```

---

## 🧠 第 7 步：（可选）限制内存占用

去重功能会使用大量内存，可根据系统内存设置 ARC 缓存上限：

```bash
echo "options zfs zfs_arc_max=8589934592" | sudo tee /etc/modprobe.d/zfs.conf
sudo update-initramfs -u
sudo reboot
```

> 上例限制 ZFS ARC 缓存为 8GB。

---

## 🧰 第 8 步：最终验证

重启系统后执行：

```bash
zpool status
zfs get mountpoint,dedup,compression zfs_pool
df -h /ssd
```

**预期输出：**
```
pool: zfs_pool
 state: ONLINE
  config:
    NAME                                    STATE
    nvme-WD_Blue_SN5000_1TB_24518D800633    ONLINE
    nvme-WD_Blue_SN5000_1TB_245185800891    ONLINE

NAME      PROPERTY     VALUE  SOURCE
zfs_pool  mountpoint   /ssd   local
zfs_pool  dedup        on     local
zfs_pool  compression  lz4    local

Filesystem      Size  Used Avail Use% Mounted on
zfs_pool        1.8T  2.0M  1.8T   1% /ssd
```

---

## ✅ 最终结果

| 项目 | 配置 |
|------|------|
| 系统盘 | Samsung SSD 980 1TB |
| 数据盘 | WD Blue SN5000 × 2 |
| ZFS 模式 | 条带（stripe） |
| 池名 | `zfs_pool` |
| 挂载点 | `/ssd` |
| 去重 | 已启用（dedup=on） |
| 压缩 | 已启用（lz4） |
| TRIM | 自动（autotrim=on） |
| 自动挂载 | 已配置（systemd + zpool.cache） |
| 状态 | ✅ ONLINE（无错误） |

---

## 💡 附录：常用命令速查

| 功能 | 命令 |
|------|------|
| 查看池状态 | `zpool status` |
| 查看池空间 | `zpool list` |
| 查看数据集属性 | `zfs get all zfs_pool` |
| 查看去重效果 | `zpool status -D` |
| 快照 | `zfs snapshot zfs_pool@snap1` |
| 恢复 | `zfs rollback zfs_pool@snap1` |
| 卸载池 | `sudo zpool export zfs_pool` |
| 导入池 | `sudo zpool import zfs_pool` |

---

✳️ **Ubuntu 已成功使用两块 SSD 组成 ZFS 条带池 `/ssd`，具备自动挂载、去重与压缩功能。**
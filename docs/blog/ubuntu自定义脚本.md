# ubuntu自定义脚本

## 脚本编写

存放在 ```/bin/lzh```

```
#!/bin/bash

show_usage() {
    echo "v1"
    echo "Available commands:"
    echo "  killsysui - Kill the systemui process"
    echo "  scrcpy3   - Start scrcpy with display 3 and resolution 800"
}

cmd=$1
arg=$2

if [ -z "$cmd" ]; then
    show_usage
elif [ "$cmd" = "killsystemui" ]; then
    adb shell killall com.android.systemui
elif [ "$cmd" = "findsystemui" ]; then
    process_id=$(adb shell "ps | grep u0_a2 | grep systemui" | tr -s ' ' | cut -d ' ' -f 2)
    process_id=$(echo $process_id | tr -d '[:space:]')
    adb logcat | grep " $process_id "
elif [ "$cmd" = "scrcpy" ]; then
    while true; do scrcpy -m 1200 --no-audio; sleep 2; done
elif [ "$cmd" = "scrcpy3" ]; then
    while true; do scrcpy --display 3 -m 800; sleep 2; done
elif [ "$cmd" = "log" ]; then
    adb logcat | grep "$arg"
elif [ "$cmd" = "reboot" ]; then
    adb reboot ; adb wait-for-usb-device root
elif [ "$cmd" = "pushsystemui" ]; then
    adb remount ; adb push '/media/root/work/work/205/205a/system/out_sys/target/product/mssi_t_64_cn_armv82/system/system_ext/priv-app/SystemUI/SystemUI.apk' /system/priv-app/EC2SystemUI/EC2SystemUI.apk
elif [ "$cmd" = "mksystemui" ]; then
    echo "mmm frameworks/base/packages/SystemUI/" |xclip -selection clipboard
elif [ "$cmd" = "build" ]; then
    cd '/205_out/205b/system' ;source build/envsetup.sh && export OUT_DIR=out_sys && lunch sys_mssi_t_64_cn_armv82-userdebug
elif [ "$cmd" = "hierarchyviewer" ]; then
    cd '/media/root/work/work/8395_1.222/ELINK_AIOT8395_R0_V1.222/alps' ;source build/envsetup.sh  && lunch 36 
elif [ "$cmd" = "gedit" ]; then
     gedit '/bin/lzh'; gedit '/etc/bash_completion.d/lzh-completion.sh' ;echo "source ~/.bashrc" |xclip -selection clipboard
elif [ "$cmd" = "claude" ]; then
     ssh root@172.20.101.23
elif [ "$cmd" = "fwq" ]; then
     ssh root@172.20.101.200 -p 2218
else

    echo "Invalid command"
    show_usage
fi
```


## 自动补全

存放在 ```/etc/bash_completion.d/lzh-completion.sh```

```
_lzh_completion() {
  local cur
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  if [[ $COMP_CWORD -eq 1 ]]; then
    COMPREPLY=( $(compgen -W "killsystemui scrcpy scrcpy3 log reboot pushsystemui mksystemui build hierarchyviewer gedit findsystemui fwq claude" -- $cur) )
    return 0
  fi
}
complete -F _lzh_completion lzh

```



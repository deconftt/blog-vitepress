# android开发常用命令

## adb命令

monkey测试
```
adb shell monkey -p com.android.monkeytest 1000000
```

系统设置的值
```
adb shell settings list secure
adb shell settings list global
adb shell settings list system
```

过滤异常log
```
adb logcat -v time | egrep "AM_|Davey\!|ANR|anr|Anr"
```

获取时间
```
adb shell date
```

设置时间
```
adb shell date 060923472023.30
```

获取包名
```
adb shell dumpsys window | grep mCurrentFocus
```

每秒获取包名
```
while true; do adb shell dumpsys window | grep mCurrentFocus ; sleep 1; done
```

发广播
```
adb shell am broadcast -a bird.intent.action.TEST
```

发广播带参数
```
adb shell am broadcast -a bird.intent.action.TEST --es EXTRA_PLAYBACK_CMD "PLAY"
```

启动应用
```
adb shell am start com.android.settings/com.android.settings.Settings
```

设置分辨率和密度
```
adb shell wm size 1920x1200;adb shell wm density 240
```

模拟触摸
```
adb shell input tap 1457 755
```




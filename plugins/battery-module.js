const { withDangerousMod, withAndroidManifest } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const BATTERY_MODULE_KT = `package com.forge.app

import android.content.Context
import android.os.PowerManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class BatteryModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "BatteryModule"

    @ReactMethod
    fun isIgnoringBatteryOptimizations(promise: Promise) {
        try {
            val pm = reactApplicationContext.getSystemService(Context.POWER_SERVICE) as PowerManager
            promise.resolve(pm.isIgnoringBatteryOptimizations(reactApplicationContext.packageName))
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }
}
`;

const BATTERY_PACKAGE_KT = `package com.forge.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BatteryPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(BatteryModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
`;

function addPermission(manifest, name) {
  const permissions = manifest["uses-permission"] || [];
  const already = permissions.some((p) => p.$["android:name"] === name);
  if (!already) {
    permissions.push({ $: { "android:name": name } });
    manifest["uses-permission"] = permissions;
  }
}

module.exports = function batteryModulePlugin(config) {
  // 1. Ajouter les permissions dans le manifest
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    addPermission(manifest, "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS");
    addPermission(manifest, "android.permission.REQUEST_INSTALL_PACKAGES");
    return config;
  });

  // 2. Écrire les fichiers Kotlin et enregistrer BatteryPackage
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const appDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/java/com/forge/app"
      );

      fs.writeFileSync(path.join(appDir, "BatteryModule.kt"), BATTERY_MODULE_KT);
      fs.writeFileSync(path.join(appDir, "BatteryPackage.kt"), BATTERY_PACKAGE_KT);

      const mainAppPath = path.join(appDir, "MainApplication.kt");
      let mainApp = fs.readFileSync(mainAppPath, "utf-8");
      if (!mainApp.includes("BatteryPackage")) {
        mainApp = mainApp.replace(
          "// add(MyReactNativePackage())",
          "add(BatteryPackage())"
        );
        fs.writeFileSync(mainAppPath, mainApp);
      }

      return config;
    },
  ]);

  return config;
};

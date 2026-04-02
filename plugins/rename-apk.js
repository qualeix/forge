const { withAppBuildGradle } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function renameApkPlugin(config) {
  return withAppBuildGradle(config, (config) => {
    // Read version and versionCode from app.json
    const appJsonPath = path.resolve(config.modRequest.projectRoot, "app.json");
    let version = "1.0.0";
    let versionCode = 1;
    
    try {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
      version = appJson.expo?.version || version;
      versionCode = appJson.expo?.android?.versionCode || versionCode;
      console.log(`[rename-apk] Reading version ${version} and versionCode ${versionCode} from app.json`);
    } catch (error) {
      console.warn("[rename-apk] Could not read version from app.json, using fallback version");
    }

    // Update versionCode and versionName in the build.gradle
    config.modResults.contents = config.modResults.contents.replace(
      /versionCode\s+\d+/,
      `versionCode ${versionCode}`
    );
    
    config.modResults.contents = config.modResults.contents.replace(
      /versionName\s+"[^"]*"/,
      `versionName "${version}"`
    );

    // Add explicit architecture splits to ensure only arm64-v8a
    const splitsBlock = `
    splits {
        abi {
            reset()
            include 'arm64-v8a'
            universalApk false
        }
    }`;

    // Add APK renaming logic
    const renameBlock = `
    applicationVariants.configureEach { variant ->
        variant.outputs.configureEach {
            outputFileName = "forge-v${version}.apk"
        }
    }`;
    
    // Find the android block and add our configuration
    const androidBlockMatch = config.modResults.contents.match(/android\s*\{/);
    if (androidBlockMatch) {
      config.modResults.contents = config.modResults.contents.replace(
        androidBlockMatch[0],
        `android {${splitsBlock}${renameBlock}`
      );
    }

    return config;
  });
};

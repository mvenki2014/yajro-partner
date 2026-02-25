import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.yajro.app',
  appName: 'Yajro',
  webDir: 'dist',
  // bundledWebRuntime: false,
  // server: {
    // Dev live-reload settings (used by `npx cap run -l`)
    // Replace with your machine IP if needed
    // url: 'http://192.168.1.12:5173',
    // cleartext: true, // allow http for local dev
    // androidScheme: 'http',
  // },
  ios: {
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: false,
    backgroundColor: '#ffffff',
    scheme: 'app',
  },
  android: {
    allowMixedContent: true, // helps with http dev APIs; lock down for prod
    backgroundColor: '#ffffff',
  },
}

export default config

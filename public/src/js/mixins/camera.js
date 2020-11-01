export default {
  data () {
    return {
      deviceList: [],
      device: { id: null }
    }
  },
  methods: {
    cameraList () {
      this.device = {}
      this.deviceList = []
      const self = this
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        for (let i = 0; i < devices.length; i++) {
          const device = devices[i]
          if (device.kind === 'videoinput') {
            self.deviceList.push({
              id: device.deviceId,
              name: device.label
            })
          }
        }
      })
    }
  }
}

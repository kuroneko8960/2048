import './style.css'

import WebFontLoader from 'webfontloader'
import App from './core/App'
import StartScene from './scenes/MainScene'

WebFontLoader.load({
  google: {
    families: ['Bellota:700&display=swap']
  },
  classes: false,
  active: () => {
    // Launch Application
    const app = new App('#app')
    app.changeScene(new StartScene())
  }
})
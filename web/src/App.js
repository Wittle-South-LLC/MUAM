import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// Below this line are post app generation
import { addLocaleData } from 'react-intl'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
import { IntlProvider } from 'react-intl'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import baseApp from './state/baseApp'
import AppContainer from './AppContainer'
import '@fortawesome/fontawesome-pro/css/all.css'

// Get browser language, found in comment here: https://stackoverflow.com/questions/673905/best-way-to-determine-users-locale-within-browser
const getLang = () => navigator.language || navigator.browserLanguage || ( navigator.languages || [ "en" ] )[ 0 ]
// Store the localized messages in a global, because for some reason
// React doesn't want the data as a class member variable
let currentLocaleData = {}

class App extends Component {
  constructor (props, context) {
    super (props, context)
    this.getLocale = this.getLocale.bind(this)
    this.loadLocale = this.loadLocale.bind(this)
    this.updateLocale = this.updateLocale.bind(this)

    // Instantiate the Redux state machine for core data model
    this.store = createStore(baseApp,
                             baseApp(undefined, {}),
                             applyMiddleware(thunkMiddleware))
    this.state = {
      locale: getLang().substring(0,2)
    }
  }

  // If the app is going to mount, load the current language data
  componentWillMount() {
    this.loadLocale(getLang().substring(0,2))
  }

  getLocale () {
    return this.state.locale
  }

  loadLocale(locale) {
    let _self = this
    // This code should initialize the locale based on the actual locale
    fetch(`/locales/${locale}.json`)
      .then((res) => {
        if (res.status >= 400) {
          throw new Error(`Unable to load locale: ${locale} from server`);
        }
        return res.json()
      })
      .then((localeData) => {
        if (locale === 'es') {
          addLocaleData(es)
        } else if (locale === 'fr') {
          addLocaleData(fr)
        }
        currentLocaleData = localeData
        _self.updateLocale(locale)
      }).catch((error) => {
        console.error('Error: ', error)
      })
  }
  updateLocale (loc) {
    this.setState({
      locale: loc
    })
  }
  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={currentLocaleData}>
        <BrowserRouter>
          <AppContainer store = {this.store}
                        changeLocale={this.loadLocale} 
                        getCurrentLocale={this.getLocale} />
        </BrowserRouter>
      </IntlProvider>
    )
  }
}

export default App;

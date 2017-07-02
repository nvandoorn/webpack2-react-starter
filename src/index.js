import React from 'react'
import ReactDOM from 'react-dom'
import FA from 'react-fontawesome'

import { app } from './index.css'
import { anotherOne } from './index.css.js'
import '../node_modules/font-awesome/css/font-awesome.css'

const App = p =>
  <div className={[app,anotherOne].join(' ')}>
    <FA name='github' />
    {p.text}
  </div>

ReactDOM.render(<App title='hello world' />, document.getElementById('root'))

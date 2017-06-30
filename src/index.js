import React from 'react'
import ReactDOM from 'react-dom'
import FA from 'react-fontawesome'

import { app } from './index.css'
import '../node_modules/font-awesome/css/font-awesome.css'

const App = p =>
  <div className={app}>
    <FA name='github' />
    {p.text}
  </div>

ReactDOM.render(<App text='hello world' />, document.getElementById('root'))

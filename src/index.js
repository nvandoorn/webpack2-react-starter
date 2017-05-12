import React from 'react'
import ReactDOM from 'react-dom'

import { app } from './index.css'

const App = p => <div className={app}>{p.text}</div>

ReactDOM.render(<App text='hello world' />, document.getElementById('root'))

// Write your tests here

import React from 'react'
import AppFunctional from './AppFunctional'
// import AppClass from './frontend/components/AppClass'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('sanity', () => {
  expect(true).toBe(true)
})

const updateStatelessSelectors = document => {
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  reset = document.querySelector('#reset')
  submit = document.querySelector('#submit')
}

const email = document.querySelector('#email')

test('Does functional component render movement buttons to screen', async() =>{
  render(<AppFunctional/>)

  expect(up).toBeInTheDocument();
  expect(down).toBeInTheDocument();
  expect(left).toBeInTheDocument();
  expect(right).toBeInTheDocument();
})

test('Does functional component have correct value when typing in the input field', async() => {
  render(<AppFunctional/>)

  fireEvent.change(email, {target:{value: 'roro@boat.com'}})
  expect(email).toHaveValue('roro@boat.com')
  

})

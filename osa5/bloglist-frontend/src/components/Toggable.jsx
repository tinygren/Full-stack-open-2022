import { useState, useImperativeHandle } from 'react'

const Toggable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : ' ' } //Toggable-komponentti määrittelee kaksi tyyliobjektia, hideWhenVisible ja showWhenVisible,
  // jotka määrittävät komponentin näkyvyyden. hideWhenVisible-tyyli piilottaa komponentin, kun visible-tila on true, ja näyttää sen, kun visible-tila on false. showWhenVisible-tyyli tekee päinvastoin: se näyttää komponentin, kun visible-tila on true, ja piilottaa sen, kun visible-tila on false.
  const showWhenVisible = { display: visible ? ' ' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Toggable

import React, { memo } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
  
  
function GameToasts() {
    return (
        <div>
            {[1,2,3,4,5,6,7,8].map(i => <ToastContainer
            key={i.toString()}
            className={`toast toast-${i}`}
            containerId={`${i}`}
            enableMultiContainer
            position="bottom-right"
            autoClose={500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            limit={1}
            closeButton={false}
            style={{top:`${0.5 + (i-1)*12.5}%`}}
            />)}
        </div>
        )
    }

export default memo(GameToasts)

  
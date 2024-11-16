import styles from './BlockTopNav.module.scss'
// import { useState } from 'react'

type BlockNavProps = {
  buttons?: any
  navValue?: any
  setNavValue?: any

  // hourNavValue?: any
  // setHourNavValue?:any
}

const BlockTopNav: React.FC<BlockNavProps> = props => {
  return (
    <ul className={styles.daily_nav}>
      {props.buttons.map((item: any, index: number) => {
        return (
          <li>
            <button
              className={
                props.navValue === index ? `${styles.button} ${styles.active}` : `${styles.button}`
              }
              onClick={() => {
                props.setNavValue(index)
              }}
            >
              {item.text}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default BlockTopNav

// const MapDashTopNav: React.FC<BlockNavProps> = props => {
//   // const [navValue, setNavValue] = useState(0)
//
//   return (
//     <ul className={styles.daily_nav}>
//       {props.buttons.map((item: any) => {
//         return (
//           <li>
//             <button
//               className={props.navValue ? `${styles.button} ${styles.active}` : `${styles.button}`}
//               onClick={() => {
//                 props.setNavValue(!props.navValue)
//               }}
//             >
//               {item.text}
//             </button>
//           </li>
//         )
//       })}
//     </ul>
//   )
// }
//
// export default MapDashTopNav

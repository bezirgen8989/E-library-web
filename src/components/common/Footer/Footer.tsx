import styles from './Footer.module.scss'
// import logo from '../../../assets/images/5GCT-logo-new.svg'

const Footer: React.FC = () => {
  return (
    <div className={styles.footer}>
      {/*<div className={styles.footer_logo}>*/}
      {/*  <img src={logo} alt='' />*/}
      {/*</div>*/}
      © 5G Catalyst Technologies Co. Ltd.
    </div>
  )
}

export default Footer
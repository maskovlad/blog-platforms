import styles from "../Loader.module.css"

export default function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={`${styles.circle} ${styles.circle1}`}></div>
        <div className={`${styles.circle} ${styles.circle2}`}></div>
        <div className={`${styles.circle} ${styles.circle3}`}></div>
      </div>
    </div>
  );
}

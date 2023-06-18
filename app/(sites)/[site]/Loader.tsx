import styles from "./Loader.module.css"

export default function Loader() {
  return (
    <div className={styles.container}>
      <div className={styles.fig1} />
      <div className={styles.wrapper1}>
        <div className={styles.fig2} />
        <div className={styles.wrapper2}>
          <div className={styles.fig3} />
          <div className={styles.fig4} />
          <div className={styles.fig5} />
        </div>
      </div>
    </div>
  );
}

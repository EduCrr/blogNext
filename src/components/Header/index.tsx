import Link from "next/link";
import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";
export const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <ActiveLink href="/" activeClassName={styles.active}>
          <a>
            <img src="/images/logo.svg" alt="" />
          </a>
        </ActiveLink>
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Conteúdos</a>
          </ActiveLink>
          <ActiveLink href="/sobre" activeClassName={styles.active}>
            <a>Quem somos?</a>
          </ActiveLink>
        </nav>
        <a className={styles.readyButton} href="www.google.com">
          Começar
        </a>
      </div>
    </header>
  );
};

import Link from 'next/link'
import userService from '../../services/users'
import { Dropdown, DropdownItem } from '../Dropdown/Dropdown'
import Logo from '../Logo/Logo'
import styles from './Header.module.css'

export default function Header({ userData }) {
    const userName = userData.first_name ? userData.first_name : "Anonymous"
    const fistLetterName = userName.slice(0, 1)

    return (
        <div className={styles.container}>
            <Link href={"/"}>
                <a><Logo /></a>
            </Link>
            <div className={styles.profile_container}>
                <p className={styles.welcome_message}>Welcome {userName}!</p>

                <Dropdown
                    actionComponent={
                        <div className={`${styles.profile_container} ${styles.pointer}`}>
                            <div className={styles.profile_icon}>
                                {fistLetterName}
                            </div>
                            <div className={styles.triangle} />
                        </div>
                    }
                >
                    <DropdownItem
                        text="Log out"
                        linkTo={'/user/login'}
                        actionFunction={userService.logOut}
                    />
                </Dropdown>
            </div>
        </div>
    )
}
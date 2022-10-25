import { useRouter } from "next/router"
import { Children, useState } from "react"
import styles from "./QueryBuilderTabs.module.css"

export default function QueryBuilderTabs({tabs, children}) {
    let router = useRouter()
    let currentTab = isNaN(router.query.tab) ? 0 : parseInt(router.query.tab)
    
    const handleClick = (e) => {
        let tabSelect = e.target.id
        if (currentTab != tabSelect) {
            router.query.tab = e.target.id
            router.push(router)
        }
    }
    
    return (
        <div className={styles.tabs}>
            <div className={styles.tab_selector}>
                {tabs.map((tab, idx) => {
                    let className = idx == currentTab ? `${styles.tab} ${styles.active}` : styles.tab
                        return (
                            <div className={className} key={idx} id={idx} onClick={handleClick}>{tab}</div>
                        )
                })}
            </div>
            {Children.map(children, (child, idx) => {
                if (idx < tabs.length) {
                    if (idx == currentTab) {
                        return (
                            <div className={styles.tab_panel} key={idx}>
                                {child}    
                            </div>
                        )
                    }
                }
                return
            })}
        </div>
    )
    
}

export function TabPanel({ children }) {
    return <>
        {children}
    </>
}
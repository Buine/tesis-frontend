import { useRouter } from "next/router"
import { Children, useState } from "react"
import styles from "./QueryBuilderTabs.module.css"

export default function QueryBuilderTabs({tabs, children}) {
    let router = useRouter()
    const [selectTab, setSelectTab] =  useState(parseInt(router.query.tab))
    
    const handleClick = (e) => {
        let tabSelect = e.target.id
        if (selectTab !=  tabSelect) {
            router.query.tab = e.target.id
            router.push(router)
            setSelectTab(e.target.id)
        }
    }
    
    return (
        <div className={styles.tabs}>
            <div className={styles.tab_selector}>
                {tabs.map((tab, idx) => {
                    let className = idx == selectTab ? `${styles.tab} ${styles.active}` : styles.tab
                        return (
                            <div className={className} key={idx} id={idx} onClick={handleClick}>{tab}</div>
                        )
                })}
            </div>
            {Children.map(children, (child, idx) => {
                if (idx < tabs.length) {
                    if (idx == selectTab) {
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
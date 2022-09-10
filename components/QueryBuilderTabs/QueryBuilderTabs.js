import { Children, useState } from "react"
import styles from "./QueryBuilderTabs.module.css"

export default function QueryBuilderTabs({defaultSelector = 0, tabs, children}) {
    const [selectTab, setSelectTab] =  useState(defaultSelector)
    
    const handleClick = (e) => {
        let tabSelect = e.target.id
        if (selectTab !=  tabSelect) {
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
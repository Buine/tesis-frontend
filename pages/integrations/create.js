import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import integrationService from "../../services/integrations";
import styles from "../../styles/IntegrationCreate.module.css"

export default function CreateIntegration() {
    const [integrationCreateData, setIntegrationCreateData] = useState({ name: '', host: '', username: '', password: '', database_name: '', port: '', ssl: false })
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(integrationCreateData)
        integrationService.createIntegration({
            name: integrationCreateData.name,
            database: {
                host: integrationCreateData.host,
                name: integrationCreateData.database_name,
                username: integrationCreateData.username,
                password: integrationCreateData.password,
                port: parseInt(integrationCreateData.port),
                ssl: integrationCreateData.ssl
            }
        }).then((response) => {
            if (!response.err) {
                router.push("/")
            } else {
                console.error(response.err)
                alert(JSON.stringify(response.err))
            }
        })
    }

    const handleInputChange = (e) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setIntegrationCreateData({
            ...integrationCreateData, [name]: value
        })
    }

    return (
        <div>
            <Head>
                <title>Create a new integration</title>
            </Head>
            
            <main className={styles.main}>
                <div>
                    <h3>Create a new integration</h3>
                    <p>Postgres Integration</p>
                </div>
                <div className={styles.window}>
                    <div className={styles.window_toolbar}>
                        <div className={styles.window_circle} style={{backgroundColor: '#FF5151'}} />
                        <div className={styles.window_circle} style={{backgroundColor: '#FFD43D'}} />
                        <div className={styles.window_circle} style={{backgroundColor: '#86CF4C'}} />
                    </div>
                    <div className={styles.window_container}>
                        <form onSubmit={handleSubmit}>
                            <label className={styles.label_bold}>Integration name</label>
                            <input
                                name="name"
                                placeholder="Name integration"
                                onChange={handleInputChange}
                                value={integrationCreateData.name}
                            ></input>
                            <label className={styles.label_bold} style={{marginTop: "15px"}}>Database info</label>
                            <label className={styles.label}>Host</label>
                            <input
                                name="host"
                                placeholder="Host database"
                                onChange={handleInputChange}
                                value={integrationCreateData.host}
                            ></input>
                            <label className={styles.label}>Username</label>
                            <input
                                name="username"
                                placeholder="Username database"
                                onChange={handleInputChange}
                                value={integrationCreateData.username}
                            ></input>
                            <label className={styles.label}>Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password database"
                                onChange={handleInputChange}
                                value={integrationCreateData.password}
                            ></input>
                            <label className={styles.label}>Database name</label>
                            <input
                                name="database_name"
                                placeholder="Name database"
                                onChange={handleInputChange}
                                value={integrationCreateData.database_name}
                            ></input>
                            <label className={styles.label}>Port</label>
                            <input
                                name="port"
                                placeholder="Port database"
                                onChange={handleInputChange}
                                value={integrationCreateData.port}
                            ></input>
                            <button style={{marginTop: "60px"}}>Create integration</button>
                        </form>
                    </div>

                </div>
               
            </main>
        </div>
    )
}

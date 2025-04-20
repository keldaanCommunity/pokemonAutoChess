import React from 'react';
import { useAppSelector } from '../../../hooks';
import { ConnectionStatus } from '../../../../../types/enum/ConnectionStatus';
import { useTranslation } from 'react-i18next';
import './connection-status-notification.css';

export const ConnectionStatusNotification = () => {
    const { t } = useTranslation()
    const connectionStatus = useAppSelector(state => state.network.connectionStatus)
    if (connectionStatus === ConnectionStatus.PENDING || connectionStatus === ConnectionStatus.CONNECTED) {
        return null
    }

    return <div className="connection-status-notification my-box">
        <img src="assets/ui/disconnected.svg" alt="Disconnected" />
        {connectionStatus === ConnectionStatus.CONNECTION_LOST && (
            <span>{t("connection_status.CONNECTION_LOST")}</span>
        )}
        {connectionStatus === ConnectionStatus.CONNECTION_FAILED && (
            <span>{t("connection_status.CONNECTION_FAILED")}</span>
        )}
    </div>
}
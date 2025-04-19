import React from 'react';
import { useAppSelector } from '../../../hooks';
import { ConnectionStatus } from '../../../../../types/enum/ConnectionStatus';
import './connection-status-notification.css';

export const ConnectionStatusNotification = () => {
    const connectionStatus = useAppSelector(state => state.network.connectionStatus)
    if (connectionStatus === ConnectionStatus.PENDING || connectionStatus === ConnectionStatus.CONNECTED) {
        return null
    }

    return <div className="connection-status-notification my-box">
        <img src="assets/ui/disconnected.svg" alt="Disconnected" />
        {connectionStatus === ConnectionStatus.CONNECTION_LOST && (
            <span>{`Connection lost. Attempting to reconnect...`}</span>
        )}
        {connectionStatus === ConnectionStatus.CONNECTION_FAILED && (
            <span>{`Connection failed. Try to refresh page.`}</span>
        )}
    </div>
}
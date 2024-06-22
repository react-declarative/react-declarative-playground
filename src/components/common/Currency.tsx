import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import { roundTicks, useSnack } from "react-declarative";

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import Ethereum from '../../icons/Ethereum';
import Bitcoin from '../../icons/Bitcoin';
import Tether from '../../icons/Tether';

import {
    OneTyped,
    FieldType,
    TypedField,
} from "react-declarative";

interface ICurrencyProps {
    coin: 'btc' | 'eth' | 'usdt';
}

const DEFAULT_PROMO_AMOUNT = 0.28;

const useStyles = makeStyles()((theme) => ({
    root: {
        position: 'relative',
    },
    container: {
        marginTop: '48px',
        padding: theme.spacing(1),
        paddingBottom: theme.spacing(2),
        width: '100%',
        background: '#0002',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        display: 'flex',
        width: '100%',
        gap: 10,
        flexDirection: 'column',
    },
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
            height: 125,
            width: 125,
        },
    },
}));

const IconMap: Record<string, React.ComponentType<any>> = {
    'btc': Bitcoin,
    'eth': Ethereum,
    'usdt': Tether,
};

const createFields = (coin: ICurrencyProps['coin']): TypedField[] => [
    {
        type: FieldType.Text,
        name: 'amount',
        title: 'Balance',
        fieldBottomMargin: '0',
        fieldRightMargin: '0',
        readonly: true,
        isDisabled() {
            return coin === 'usdt';
        },
        description: coin === 'usdt'
            ? 'Payment gateway is unavalible'
            : 'Avalible in wallet',
    }
];

const Currency = ({
    coin,
}: ICurrencyProps) => {
    const { classes } = useStyles();
    const enqueueSnackbar = useSnack();
    const [data, setData] = useState<any>(null);
    const Coin = IconMap[coin]!;

    const handleChange = (data: any) => setData(data);

    const handleClick = (deposit = false) => () => {
        if (deposit) {
            enqueueSnackbar('You should specify the wallet address in the settings first to deposit funds');
        } else {
            enqueueSnackbar('You should specify the wallet address in the settings first to withdraw funds');
        }
    };

    const handler = () => ({
        amount: roundTicks(DEFAULT_PROMO_AMOUNT),
    });

    const fields = createFields(coin);

    return (
        <Paper className={classes.root}>
            <div className={classes.container}>
                <div className={classes.content}>
                    <div className={classes.avatar}>
                        <Coin />
                    </div>
                    <OneTyped
                        change={handleChange}
                        handler={handler}
                        fields={fields}
                        sx={{ mb: 2 }}
                    />
                    <Button onClick={handleClick(true)} variant="contained" color="success">
                        Deposit
                    </Button>
                    <Button onClick={handleClick(false)} variant="outlined" color="error">
                        Withdraw
                    </Button>
                </div>
            </div>
        </Paper>
    );
};

export const BtcCurrency = () => <Currency coin='btc' />;
export const EthCurrency = () => <Currency coin='eth' />;
export const UsdtCurrency = () => <Currency coin='usdt' />;

(window as any).BtcCurrency = BtcCurrency;
(window as any).EthCurrency = EthCurrency;
(window as any).UsdtCurrency = UsdtCurrency;

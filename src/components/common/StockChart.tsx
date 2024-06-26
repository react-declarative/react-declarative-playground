import * as React from 'react';
import { useRef, useLayoutEffect } from 'react';

import { makeStyles } from '../../styles';

import {
    DeepPartial,
    ChartOptions,
    CrosshairMode,
} from 'lightweight-charts';

import { createChart } from 'lightweight-charts';

import stocks from '../../mock/stocks.json';
import { useElementSize } from 'react-declarative';

interface IChartProps {
    height: number;
    width: number;
    items: IStockItem[];
}

interface IStockItem {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

const useStyles = makeStyles()({
    root: {
        position: 'relative',
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    tooltip: {
        position: 'absolute',
        color: 'gray',
        margin: 0,
        left: 5,
        top: 5,
    },
});

const chartOptions: DeepPartial<ChartOptions> = {
    layout: {
        textColor: '#d1d4dc',
        backgroundColor: '#0000',
    },
    rightPriceScale: {
        scaleMargins: {
            top: 0.3,
            bottom: 0.25,
        },
    },
    crosshair: {
        vertLine: {
            width: 4,
            color: '#ebe0e301',
            style: 0,
        },
        horzLine: {
            visible: false,
            labelVisible: false,
        },
    },
    grid: {
        vertLines: {
            color: '#f8b3',
        },
        horzLines: {
            color: '#f8b3',
        },
    },
    handleScroll: {
        vertTouchDrag: false,
    },
};

type Ref = React.MutableRefObject<HTMLDivElement>;

const Chart = ({
    height,
    width,
    items,
}: IChartProps) => {

    const { classes } = useStyles();

    const elementRef: Ref = useRef<HTMLDivElement>(
        undefined as never
    );

    useLayoutEffect(() => {

        const { current: chartElement } = elementRef;
        const data = items.slice(0);

        const chart = createChart(chartElement, {
            ...chartOptions,
            width,
            height,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
        });

        const candleSeries = chart.addCandlestickSeries();

        candleSeries.setData(data);

        const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        const getRandomPrice = (move = 1) => {
            const price = Math.max(randomInteger(lastClose - move, lastClose + move), 10);
            console.log(price);
            return price;
        };

        let lastClose = data[data.length - 1].close;
        let lastIndex = data.length - 1;

        let targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
        let targetPrice = getRandomPrice();

        let currentIndex = lastIndex + 1;
        let currentBusinessDay = { day: 29, month: 5, year: 2019 };
        let ticksInCurrentBar = 0;

        let currentBar: any = {
            open: null,
            high: null,
            low: null,
            close: null,
            time: currentBusinessDay,
        };

        const mergeTickToBar = (price: any) => {
            if (currentBar.open === null) {
                currentBar.open = price;
                currentBar.high = price;
                currentBar.low = price;
                currentBar.close = price;
            } else {
                currentBar.close = price;
                currentBar.high = Math.max(currentBar.high, price);
                currentBar.low = Math.min(currentBar.low, price);
            }
            candleSeries.update(currentBar);
        }

        const reset = () => {
            candleSeries.setData(data);
            lastClose = data[data.length - 1].close;
            lastIndex = data.length - 1;

            targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
            targetPrice = getRandomPrice();

            currentIndex = lastIndex + 1;
            currentBusinessDay = { day: 29, month: 5, year: 2019 };
            ticksInCurrentBar = 0;
        }

        const nextBusinessDay = (time: any) => {
            var d = new Date();
            d.setUTCFullYear(time.year);
            d.setUTCMonth(time.month - 1);
            d.setUTCDate(time.day + 1);
            d.setUTCHours(0, 0, 0, 0);
            return {
                year: d.getUTCFullYear(),
                month: d.getUTCMonth() + 1,
                day: d.getUTCDate(),
            };
        }

        const interval = setInterval(() => {
            var deltaY = targetPrice - lastClose;
            var deltaX = targetIndex - lastIndex;
            var angle = deltaY / deltaX;
            var basePrice = lastClose + (currentIndex - lastIndex) * angle;
            var noise = (0.1 - Math.random() * 0.2) + 1.0;
            var noisedPrice = basePrice * noise;
            mergeTickToBar(noisedPrice);
            if (++ticksInCurrentBar === 5) {
                // move to next bar
                currentIndex++;
                currentBusinessDay = nextBusinessDay(currentBusinessDay);
                currentBar = {
                    open: null,
                    high: null,
                    low: null,
                    close: null,
                    time: currentBusinessDay,
                };
                ticksInCurrentBar = 0;
                if (currentIndex === 5000) {
                    reset();
                    return;
                }
                if (currentIndex === targetIndex) {
                    // change trend
                    lastClose = noisedPrice;
                    lastIndex = currentIndex;
                    targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
                    targetPrice = getRandomPrice();
                }
            }
        }, 1_000);

        chart.timeScale().fitContent();

        return () => {
            clearInterval(interval);
            chart.remove();
        };
    }, [height, width, items]);

    return (
        <div
            ref={elementRef}
            className={classes.container}
        >
        </div>
    );
};

export const StockChart = () => {
    const { classes } = useStyles();
    const { elementRef, size } = useElementSize<HTMLDivElement>();
    return (
        <div className={classes.root} ref={elementRef}>
            <Chart
                {...size}
                items={stocks}
            />
        </div>
    );
}

(window as any).StockChart = StockChart;

export default StockChart;

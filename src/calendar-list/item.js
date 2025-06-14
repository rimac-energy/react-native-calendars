import React, { useMemo, useCallback } from 'react';
import { Text } from 'react-native';
import { toMarkingFormat } from '../interface';
import { extractCalendarProps } from '../componentUpdater';
import styleConstructor from './style';
import Calendar from '../calendar';
const CalendarListItem = React.memo((props) => {
    const { item, theme, scrollToMonth, horizontal, calendarHeight, calendarWidth, style: propsStyle, headerStyle, onPressArrowLeft, onPressArrowRight, visible } = props;
    const style = styleConstructor(theme);
    const calendarProps = extractCalendarProps(props);
    const dateString = toMarkingFormat(item);
    const calendarStyle = useMemo(() => {
        return [
            {
                width: calendarWidth,
                minHeight: calendarHeight
            },
            style.calendar,
            propsStyle
        ];
    }, [style, calendarWidth, calendarHeight, propsStyle]);
    const textStyle = useMemo(() => {
        return [calendarStyle, style.placeholderText];
    }, [style, calendarStyle]);
    const _onPressArrowLeft = useCallback((method, month) => {
        const monthClone = month?.clone();
        if (monthClone) {
            if (onPressArrowLeft) {
                onPressArrowLeft(method, monthClone);
            }
            else if (scrollToMonth) {
                const currentMonth = monthClone.getMonth();
                monthClone.addMonths(-1);
                // Make sure we actually get the previous month, not just 30 days before currentMonth.
                while (monthClone.getMonth() === currentMonth) {
                    monthClone.setDate(monthClone.getDate() - 1);
                }
                scrollToMonth(monthClone);
            }
        }
    }, [onPressArrowLeft, scrollToMonth]);
    const _onPressArrowRight = useCallback((method, month) => {
        const monthClone = month?.clone();
        if (monthClone) {
            if (onPressArrowRight) {
                onPressArrowRight(method, monthClone);
            }
            else if (scrollToMonth) {
                monthClone.addMonths(1);
                scrollToMonth(monthClone);
            }
        }
    }, [onPressArrowRight, scrollToMonth]);
    if (!visible) {
        return (<Text style={textStyle}>{dateString}</Text>);
    }
    return (<Calendar hideArrows={true} hideExtraDays={true} {...calendarProps} current={dateString} style={calendarStyle} headerStyle={horizontal ? headerStyle : undefined} disableMonthChange onPressArrowLeft={horizontal ? _onPressArrowLeft : onPressArrowLeft} onPressArrowRight={horizontal ? _onPressArrowRight : onPressArrowRight}/>);
});
export default CalendarListItem;
CalendarListItem.displayName = 'CalendarListItem';

import PropTypes from 'prop-types';
import XDate from 'xdate';
import React, { Component } from 'react';
import { Animated, ViewStyle, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { DateData, AgendaSchedule } from '../types';
import { CalendarListProps } from '../calendar-list';
import ReservationList, { ReservationListProps } from './reservation-list';
export type AgendaProps = CalendarListProps & ReservationListProps & {
    /** the list of items that have to be displayed in agenda. If you want to render item as empty date
    the value of date key kas to be an empty array []. If there exists no value for date key it is
    considered that the date in question is not yet loaded */
    items?: AgendaSchedule;
    /** callback that gets called when items for a certain month should be loaded (month became visible) */
    loadItemsForMonth?: (data: DateData) => void;
    /** callback that fires when the calendar is opened or closed */
    onCalendarToggled?: (enabled: boolean) => void;
    /** callback that gets called when day changes while scrolling agenda list */
    onDayChange?: (data: DateData) => void;
    /** specify how agenda knob should look like */
    renderKnob?: () => JSX.Element;
    /** override inner list with a custom implemented component */
    renderList?: (listProps: ReservationListProps) => JSX.Element;
    /** initially selected day */
    selected?: string;
    /** Hide knob button. Default = false */
    hideKnob?: boolean;
    /** Whether the knob should always be visible (when hideKnob = false) */
    showClosingKnob?: boolean;
};
type State = {
    scrollY: Animated.Value;
    calendarIsReady: boolean;
    calendarScrollable: boolean;
    firstReservationLoad: boolean;
    selectedDay: XDate;
    topDay: XDate;
};
/**
 * @description: Agenda component
 * @extends: CalendarList
 * @extendslink: docs/CalendarList
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/agenda.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/assets/agenda.gif
 */
export default class Agenda extends Component<AgendaProps, State> {
    static displayName: string;
    static propTypes: {
        items: PropTypes.Requireable<object>;
        style: PropTypes.Requireable<NonNullable<number | object | null | undefined>>;
        loadItemsForMonth: PropTypes.Requireable<(...args: any[]) => any>;
        onCalendarToggled: PropTypes.Requireable<(...args: any[]) => any>;
        onDayChange: PropTypes.Requireable<(...args: any[]) => any>;
        renderKnob: PropTypes.Requireable<(...args: any[]) => any>;
        renderList: PropTypes.Requireable<(...args: any[]) => any>;
        selected: PropTypes.Requireable<any>;
        hideKnob: PropTypes.Requireable<boolean>;
        showClosingKnob: PropTypes.Requireable<boolean>;
        selectedDay: PropTypes.Requireable<XDate>;
        topDay: PropTypes.Requireable<XDate>;
        showOnlySelectedDayItems: PropTypes.Requireable<boolean>;
        renderEmptyData: PropTypes.Requireable<(...args: any[]) => any>;
        onScroll: PropTypes.Requireable<(...args: any[]) => any>;
        onScrollBeginDrag: PropTypes.Requireable<(...args: any[]) => any>;
        onScrollEndDrag: PropTypes.Requireable<(...args: any[]) => any>;
        onMomentumScrollBegin: PropTypes.Requireable<(...args: any[]) => any>;
        onMomentumScrollEnd: PropTypes.Requireable<(...args: any[]) => any>;
        refreshControl: PropTypes.Requireable<PropTypes.ReactElementLike>;
        refreshing: PropTypes.Requireable<boolean>;
        onRefresh: PropTypes.Requireable<(...args: any[]) => any>;
        reservationsKeyExtractor: PropTypes.Requireable<(...args: any[]) => any>;
        date: PropTypes.Requireable<any>;
        item: PropTypes.Requireable<any>;
        theme: PropTypes.Requireable<object>; /** callback that gets called when items for a certain month should be loaded (month became visible) */
        rowHasChanged: PropTypes.Requireable<(...args: any[]) => any>;
        renderDay: PropTypes.Requireable<(...args: any[]) => any>;
        renderItem: PropTypes.Requireable<(...args: any[]) => any>;
        renderEmptyDate: PropTypes.Requireable<(...args: any[]) => any>;
        pastScrollRange?: React.Validator<number | null | undefined> | undefined;
        futureScrollRange?: React.Validator<number | null | undefined> | undefined;
        calendarWidth?: React.Validator<number | null | undefined> | undefined;
        calendarHeight?: React.Validator<number | null | undefined> | undefined;
        calendarStyle?: React.Validator<ViewStyle | null | undefined> | undefined;
        staticHeader?: React.Validator<boolean | null | undefined> | undefined;
        showScrollIndicator?: React.Validator<boolean | null | undefined> | undefined;
        animateScroll?: React.Validator<boolean | null | undefined> | undefined;
        current?: React.Validator<string | null | undefined> | undefined;
        initialDate?: React.Validator<string | null | undefined> | undefined;
        minDate?: React.Validator<string | null | undefined> | undefined;
        maxDate?: React.Validator<string | null | undefined> | undefined;
        allowSelectionOutOfRange?: React.Validator<boolean | null | undefined> | undefined;
        markedDates?: React.Validator<import("../types").MarkedDates | null | undefined> | undefined;
        hideExtraDays?: React.Validator<boolean | null | undefined> | undefined;
        showSixWeeks?: React.Validator<boolean | null | undefined> | undefined;
        onDayPress?: React.Validator<((date: DateData) => void) | null | undefined> | undefined;
        onDayLongPress?: React.Validator<((date: DateData) => void) | null | undefined> | undefined;
        onMonthChange?: React.Validator<((date: DateData) => void) | null | undefined> | undefined;
        onVisibleMonthsChange?: React.Validator<((months: DateData[]) => void) | null | undefined> | undefined;
        disableMonthChange?: React.Validator<boolean | null | undefined> | undefined;
        enableSwipeMonths?: React.Validator<boolean | null | undefined> | undefined;
        headerStyle?: React.Validator<import("react-native").StyleProp<ViewStyle>> | undefined;
        customHeader?: React.Validator<any> | undefined;
        disabledByDefault?: React.Validator<boolean | null | undefined> | undefined;
        disabledByWeekDays?: React.Validator<number[] | null | undefined> | undefined;
        testID?: React.Validator<string | null | undefined> | undefined;
        month?: React.Validator<XDate | null | undefined> | undefined;
        addMonth?: React.Validator<((num: number) => void) | null | undefined> | undefined;
        firstDay?: React.Validator<number | null | undefined> | undefined;
        displayLoadingIndicator?: React.Validator<boolean | null | undefined> | undefined;
        showWeekNumbers?: React.Validator<boolean | null | undefined> | undefined;
        monthFormat?: React.Validator<string | null | undefined> | undefined;
        hideDayNames?: React.Validator<boolean | null | undefined> | undefined;
        hideArrows?: React.Validator<boolean | null | undefined> | undefined;
        renderArrow?: React.Validator<((direction: import("../types").Direction) => React.ReactNode) | null | undefined> | undefined;
        onPressArrowLeft?: React.Validator<((method: () => void, month?: XDate | undefined) => void) | null | undefined> | undefined;
        onPressArrowRight?: React.Validator<((method: () => void, month?: XDate | undefined) => void) | null | undefined> | undefined;
        arrowsHitSlop?: React.Validator<number | import("react-native").Insets | null | undefined> | undefined;
        disableArrowLeft?: React.Validator<boolean | null | undefined> | undefined;
        disableArrowRight?: React.Validator<boolean | null | undefined> | undefined;
        disabledDaysIndexes?: React.Validator<number[] | null | undefined> | undefined;
        renderHeader?: React.Validator<((date?: XDate | undefined, info?: Pick<import("../calendar/header").CalendarHeaderProps, "testID"> | undefined) => React.ReactNode) | null | undefined> | undefined;
        customHeaderTitle?: React.Validator<JSX.Element | null | undefined> | undefined;
        webAriaLevel?: React.Validator<number | null | undefined> | undefined;
        accessibilityElementsHidden?: React.Validator<boolean | null | undefined> | undefined;
        importantForAccessibility?: React.Validator<"auto" | "yes" | "no" | "no-hide-descendants" | null | undefined> | undefined;
        numberOfDays?: React.Validator<number | null | undefined> | undefined;
        timelineLeftInset?: React.Validator<number | null | undefined> | undefined;
        onHeaderLayout?: React.Validator<((event: LayoutChangeEvent) => void) | null | undefined> | undefined;
        dayComponent?: React.Validator<React.ComponentType<import("../calendar/day").DayProps & {
            date?: DateData | undefined;
        }> | null | undefined> | undefined;
        state?: React.Validator<import("../types").DayState | null | undefined> | undefined;
        marking?: React.Validator<import("../calendar/day/marking").MarkingProps | null | undefined> | undefined;
        markingType?: React.Validator<import("../types").MarkingTypes | null | undefined> | undefined;
        onPress?: React.Validator<((date?: DateData | undefined) => void) | null | undefined> | undefined;
        onLongPress?: React.Validator<((date?: DateData | undefined) => void) | null | undefined> | undefined;
        disableAllTouchEventsForDisabledDays?: React.Validator<boolean | null | undefined> | undefined;
        disableAllTouchEventsForInactiveDays?: React.Validator<boolean | null | undefined> | undefined;
        accessibilityLabel?: React.Validator<string | null | undefined> | undefined;
        children?: React.Validator<React.ReactNode> | undefined;
        hitSlop?: React.Validator<import("react-native").Insets | null | undefined> | undefined;
        id?: React.Validator<string | null | undefined> | undefined;
        onLayout?: React.Validator<((event: LayoutChangeEvent) => void) | null | undefined> | undefined;
        pointerEvents?: React.Validator<"auto" | "none" | "box-none" | "box-only" | null | undefined> | undefined;
        removeClippedSubviews?: React.Validator<boolean | null | undefined> | undefined;
        nativeID?: React.Validator<string | null | undefined> | undefined;
        collapsable?: React.Validator<boolean | null | undefined> | undefined;
        needsOffscreenAlphaCompositing?: React.Validator<boolean | null | undefined> | undefined;
        renderToHardwareTextureAndroid?: React.Validator<boolean | null | undefined> | undefined;
        focusable?: React.Validator<boolean | null | undefined> | undefined;
        shouldRasterizeIOS?: React.Validator<boolean | null | undefined> | undefined;
        isTVSelectable?: React.Validator<boolean | null | undefined> | undefined;
        hasTVPreferredFocus?: React.Validator<boolean | null | undefined> | undefined;
        tvParallaxProperties?: React.Validator<import("react-native").TVParallaxProperties | null | undefined> | undefined;
        tvParallaxShiftDistanceX?: React.Validator<number | null | undefined> | undefined;
        tvParallaxShiftDistanceY?: React.Validator<number | null | undefined> | undefined;
        tvParallaxTiltAngle?: React.Validator<number | null | undefined> | undefined;
        tvParallaxMagnification?: React.Validator<number | null | undefined> | undefined;
        onStartShouldSetResponder?: React.Validator<((event: import("react-native").GestureResponderEvent) => boolean) | null | undefined> | undefined;
        onMoveShouldSetResponder?: React.Validator<((event: import("react-native").GestureResponderEvent) => boolean) | null | undefined> | undefined;
        onResponderEnd?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onResponderGrant?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onResponderReject?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onResponderMove?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onResponderRelease?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onResponderStart?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onResponderTerminationRequest?: React.Validator<((event: import("react-native").GestureResponderEvent) => boolean) | null | undefined> | undefined;
        onResponderTerminate?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onStartShouldSetResponderCapture?: React.Validator<((event: import("react-native").GestureResponderEvent) => boolean) | null | undefined> | undefined;
        onMoveShouldSetResponderCapture?: React.Validator<((event: import("react-native").GestureResponderEvent) => boolean) | null | undefined> | undefined;
        onTouchStart?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onTouchMove?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onTouchEnd?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onTouchCancel?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onTouchEndCapture?: React.Validator<((event: import("react-native").GestureResponderEvent) => void) | null | undefined> | undefined;
        onPointerEnter?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerEnterCapture?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerLeave?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerLeaveCapture?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerMove?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerMoveCapture?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerCancel?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerCancelCapture?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerDown?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerDownCapture?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerUp?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        onPointerUpCapture?: React.Validator<((event: import("react-native").PointerEvent) => void) | null | undefined> | undefined;
        accessible?: React.Validator<boolean | null | undefined> | undefined;
        accessibilityActions?: React.Validator<readonly Readonly<{
            name: string;
            label?: string | undefined;
        }>[] | null | undefined> | undefined;
        'aria-label'?: React.Validator<string | null | undefined> | undefined;
        accessibilityRole?: React.Validator<import("react-native").AccessibilityRole | null | undefined> | undefined;
        accessibilityState?: React.Validator<import("react-native").AccessibilityState | null | undefined> | undefined;
        'aria-busy'?: React.Validator<boolean | null | undefined> | undefined;
        'aria-checked'?: React.Validator<boolean | "mixed" | null | undefined> | undefined;
        'aria-disabled'?: React.Validator<boolean | null | undefined> | undefined;
        'aria-expanded'?: React.Validator<boolean | null | undefined> | undefined;
        'aria-selected'?: React.Validator<boolean | null | undefined> | undefined;
        'aria-labelledby'?: React.Validator<string | null | undefined> | undefined;
        accessibilityHint?: React.Validator<string | null | undefined> | undefined;
        accessibilityValue?: React.Validator<import("react-native").AccessibilityValue | null | undefined> | undefined;
        'aria-valuemax'?: React.Validator<number | null | undefined> | undefined;
        'aria-valuemin'?: React.Validator<number | null | undefined> | undefined;
        'aria-valuenow'?: React.Validator<number | null | undefined> | undefined;
        'aria-valuetext'?: React.Validator<string | null | undefined> | undefined;
        onAccessibilityAction?: React.Validator<((event: import("react-native").AccessibilityActionEvent) => void) | null | undefined> | undefined;
        'aria-hidden'?: React.Validator<boolean | null | undefined> | undefined;
        'aria-live'?: React.Validator<"polite" | "assertive" | "off" | null | undefined> | undefined;
        'aria-modal'?: React.Validator<boolean | null | undefined> | undefined;
        role?: React.Validator<import("react-native").Role | null | undefined> | undefined;
        accessibilityLiveRegion?: React.Validator<"none" | "polite" | "assertive" | null | undefined> | undefined;
        accessibilityLabelledBy?: React.Validator<string | string[] | null | undefined> | undefined;
        accessibilityViewIsModal?: React.Validator<boolean | null | undefined> | undefined;
        onAccessibilityEscape?: React.Validator<(() => void) | null | undefined> | undefined;
        onAccessibilityTap?: React.Validator<(() => void) | null | undefined> | undefined;
        onMagicTap?: React.Validator<(() => void) | null | undefined> | undefined;
        accessibilityIgnoresInvertColors?: React.Validator<boolean | null | undefined> | undefined;
        accessibilityLanguage?: React.Validator<string | null | undefined> | undefined;
        horizontal?: React.Validator<boolean | null | undefined> | undefined;
        columnWrapperStyle?: React.Validator<import("react-native").StyleProp<ViewStyle>> | undefined;
        keyboardShouldPersistTaps?: React.Validator<boolean | "never" | "always" | "handled" | null | undefined> | undefined;
        extraData?: React.Validator<any> | undefined;
        getItemLayout?: React.Validator<((data: ArrayLike<any> | null | undefined, index: number) => {
            length: number;
            offset: number;
            index: number;
        }) | null | undefined> | undefined;
        initialNumToRender?: React.Validator<number | null | undefined> | undefined;
        initialScrollIndex?: React.Validator<number | null | undefined> | undefined;
        keyExtractor?: React.Validator<((item: any, index: number) => string) | null | undefined> | undefined;
        legacyImplementation?: React.Validator<boolean | null | undefined> | undefined;
        numColumns?: React.Validator<number | null | undefined> | undefined;
        onViewableItemsChanged?: React.Validator<((info: {
            viewableItems: import("react-native").ViewToken[];
            changed: import("react-native").ViewToken[];
        }) => void) | null | undefined> | undefined;
        viewabilityConfig?: React.Validator<import("react-native").ViewabilityConfig | null | undefined> | undefined;
        fadingEdgeLength?: React.Validator<number | null | undefined> | undefined;
        ItemSeparatorComponent?: React.Validator<React.ComponentType<any> | null | undefined> | undefined;
        ListEmptyComponent?: React.Validator<React.ComponentType<any> | React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined> | undefined;
        ListFooterComponent?: React.Validator<React.ComponentType<any> | React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined> | undefined;
        ListFooterComponentStyle?: React.Validator<import("react-native").StyleProp<ViewStyle>> | undefined;
        ListHeaderComponent?: React.Validator<React.ComponentType<any> | React.ReactElement<any, string | React.JSXElementConstructor<any>> | null | undefined> | undefined;
        ListHeaderComponentStyle?: React.Validator<import("react-native").StyleProp<ViewStyle>> | undefined;
        debug?: React.Validator<boolean | null | undefined> | undefined;
        disableVirtualization?: React.Validator<boolean | null | undefined> | undefined;
        getItem?: React.Validator<((data: any, index: number) => any) | null | undefined> | undefined;
        getItemCount?: React.Validator<((data: any) => number) | null | undefined> | undefined;
        inverted?: React.Validator<boolean | null | undefined> | undefined;
        maxToRenderPerBatch?: React.Validator<number | null | undefined> | undefined;
        onEndReached?: React.Validator<((info: {
            distanceFromEnd: number;
        }) => void) | null | undefined> | undefined;
        onEndReachedThreshold?: React.Validator<number | null | undefined> | undefined;
        onScrollToIndexFailed?: React.Validator<((info: {
            index: number;
            highestMeasuredFrameIndex: number;
            averageItemLength: number;
        }) => void) | null | undefined> | undefined;
        onStartReached?: React.Validator<((info: {
            distanceFromStart: number;
        }) => void) | null | undefined> | undefined;
        onStartReachedThreshold?: React.Validator<number | null | undefined> | undefined;
        progressViewOffset?: React.Validator<number | null | undefined> | undefined;
        renderScrollComponent?: React.Validator<((props: import("react-native").ScrollViewProps) => React.ReactElement<import("react-native").ScrollViewProps, string | React.JSXElementConstructor<any>>) | null | undefined> | undefined;
        updateCellsBatchingPeriod?: React.Validator<number | null | undefined> | undefined;
        viewabilityConfigCallbackPairs?: React.Validator<import("react-native").ViewabilityConfigCallbackPairs | null | undefined> | undefined;
        windowSize?: React.Validator<number | null | undefined> | undefined;
        CellRendererComponent?: React.Validator<React.ComponentType<import("react-native").CellRendererProps<any>> | null | undefined> | undefined;
        contentContainerStyle?: React.Validator<import("react-native").StyleProp<ViewStyle>> | undefined;
        decelerationRate?: React.Validator<number | "normal" | "fast" | null | undefined> | undefined;
        invertStickyHeaders?: React.Validator<boolean | null | undefined> | undefined;
        keyboardDismissMode?: React.Validator<"none" | "interactive" | "on-drag" | null | undefined> | undefined;
        onContentSizeChange?: React.Validator<((w: number, h: number) => void) | null | undefined> | undefined;
        pagingEnabled?: React.Validator<boolean | null | undefined> | undefined;
        scrollEnabled?: React.Validator<boolean | null | undefined> | undefined;
        showsHorizontalScrollIndicator?: React.Validator<boolean | null | undefined> | undefined;
        showsVerticalScrollIndicator?: React.Validator<boolean | null | undefined> | undefined;
        stickyHeaderHiddenOnScroll?: React.Validator<boolean | null | undefined> | undefined;
        snapToInterval?: React.Validator<number | null | undefined> | undefined;
        snapToOffsets?: React.Validator<number[] | null | undefined> | undefined;
        snapToStart?: React.Validator<boolean | null | undefined> | undefined;
        snapToEnd?: React.Validator<boolean | null | undefined> | undefined;
        stickyHeaderIndices?: React.Validator<number[] | null | undefined> | undefined;
        disableIntervalMomentum?: React.Validator<boolean | null | undefined> | undefined;
        disableScrollViewPanResponder?: React.Validator<boolean | null | undefined> | undefined;
        StickyHeaderComponent?: React.Validator<React.ComponentType<any> | null | undefined> | undefined;
        alwaysBounceHorizontal?: React.Validator<boolean | null | undefined> | undefined;
        alwaysBounceVertical?: React.Validator<boolean | null | undefined> | undefined;
        automaticallyAdjustContentInsets?: React.Validator<boolean | null | undefined> | undefined;
        automaticallyAdjustKeyboardInsets?: React.Validator<boolean | null | undefined> | undefined;
        automaticallyAdjustsScrollIndicatorInsets?: React.Validator<boolean | null | undefined> | undefined;
        bounces?: React.Validator<boolean | null | undefined> | undefined;
        bouncesZoom?: React.Validator<boolean | null | undefined> | undefined;
        canCancelContentTouches?: React.Validator<boolean | null | undefined> | undefined;
        centerContent?: React.Validator<boolean | null | undefined> | undefined;
        contentInset?: React.Validator<import("react-native").Insets | null | undefined> | undefined;
        contentOffset?: React.Validator<import("react-native").PointProp | null | undefined> | undefined;
        contentInsetAdjustmentBehavior?: React.Validator<"never" | "always" | "automatic" | "scrollableAxes" | null | undefined> | undefined;
        directionalLockEnabled?: React.Validator<boolean | null | undefined> | undefined;
        indicatorStyle?: React.Validator<"white" | "default" | "black" | null | undefined> | undefined;
        maintainVisibleContentPosition?: React.Validator<{
            autoscrollToTopThreshold?: number | null | undefined;
            minIndexForVisible: number;
        } | null | undefined> | undefined;
        maximumZoomScale?: React.Validator<number | null | undefined> | undefined;
        minimumZoomScale?: React.Validator<number | null | undefined> | undefined;
        onScrollAnimationEnd?: React.Validator<(() => void) | null | undefined> | undefined;
        pinchGestureEnabled?: React.Validator<boolean | null | undefined> | undefined;
        scrollEventThrottle?: React.Validator<number | null | undefined> | undefined;
        scrollIndicatorInsets?: React.Validator<import("react-native").Insets | null | undefined> | undefined;
        scrollToOverflowEnabled?: React.Validator<boolean | null | undefined> | undefined;
        scrollsToTop?: React.Validator<boolean | null | undefined> | undefined;
        snapToAlignment?: React.Validator<"center" | "end" | "start" | null | undefined> | undefined;
        onScrollToTop?: React.Validator<((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | null | undefined> | undefined;
        zoomScale?: React.Validator<number | null | undefined> | undefined;
        endFillColor?: React.Validator<import("react-native").ColorValue | null | undefined> | undefined;
        scrollPerfTag?: React.Validator<string | null | undefined> | undefined;
        overScrollMode?: React.Validator<"auto" | "never" | "always" | null | undefined> | undefined;
        nestedScrollEnabled?: React.Validator<boolean | null | undefined> | undefined;
        persistentScrollbar?: React.Validator<boolean | null | undefined> | undefined;
        context?: React.Validator<import("../expandableCalendar/Context").CalendarContextProps | null | undefined> | undefined;
        ref?: React.Validator<React.LegacyRef<unknown> | undefined> | undefined;
        key?: React.Validator<React.Key | null | undefined> | undefined;
    };
    private style;
    private viewHeight;
    private viewWidth;
    private scrollTimeout?;
    private headerState;
    private currentMonth;
    private knobTracker;
    private _isMounted;
    private scrollPad;
    private calendar;
    private knob;
    list: React.RefObject<ReservationList>;
    constructor(props: AgendaProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: AgendaProps, prevState: State): void;
    static getDerivedStateFromProps(nextProps: AgendaProps): {
        firstReservationLoad: boolean;
    } | null;
    getSelectedDate(date?: string): XDate;
    calendarOffset(): number;
    initialScrollPadPosition: () => number;
    setScrollPadPosition: (y: number, animated: boolean) => void;
    toggleCalendarPosition: (open: boolean) => void;
    enableCalendarScrolling(enable?: boolean): void;
    loadReservations(props: AgendaProps): void;
    onDayPress: (d: DateData) => void;
    chooseDay(d: DateData, optimisticScroll: boolean): void;
    generateMarkings: (this: any, selectedDay: any, markedDates: any, items: any) => any;
    onScrollPadLayout: () => void;
    onCalendarListLayout: () => void;
    onLayout: (event: LayoutChangeEvent) => void;
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onStartDrag: () => void;
    onSnapAfterDrag: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onVisibleMonthsChange: (months: DateData[]) => void;
    onDayChange: (day: XDate) => void;
    renderReservations(): React.JSX.Element;
    renderCalendarList(): React.JSX.Element;
    renderKnob(): JSX.Element | null;
    renderWeekDaysNames: () => React.JSX.Element;
    renderWeekNumbersSpace: () => false | React.JSX.Element | undefined;
    render(): React.JSX.Element;
}
export {};

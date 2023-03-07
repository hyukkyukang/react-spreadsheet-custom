import * as React from "react";
import classNames from "classnames";
import { columnIndexToLabel } from "hot-formula-parser";
import * as Types from "./types";
import * as Point from "./point";
import * as Actions from "./actions";
import * as Selection from "./selection";
import { isActive } from "./util";
import useDispatch from "./use-dispatch";
import useSelector from "./use-selector";

const ColumnIndicator: Types.ColumnIndicatorComponent = ({ column, label, selected, selectedPoint, active, onSelect, activate }) => {
    const handleClick = React.useCallback(
        (event: React.MouseEvent) => {
            onSelect(column);
        },
        [onSelect, column]
    );
    return (
        <th
            className={classNames("Spreadsheet__header", {
                "Spreadsheet__header--selected": selected,
            })}
            onClick={handleClick}
            tabIndex={0}
        >
            {label !== undefined ? label : columnIndexToLabel(String(column))}
        </th>
    );
};

export default ColumnIndicator;

export const enhance = (
    ColumnIndicatorComponent: Types.ColumnIndicatorComponent
): React.FC<Omit<Types.ColumnIndicatorProps, "selected" | "selectedPoint" | "active" | "onSelect" | "activate">> => {
    return function ColumnIndicatorWrapper(props) {
        const current_column: number = props.column;
        const dispatch = useDispatch();
        const select = React.useCallback(
            (column: number) => {
                dispatch(Actions.select({ column: column, row: -1 } as Point.Point));
            },
            [dispatch]
        );
        const activate = React.useCallback((point: Point.Point) => dispatch(Actions.activate(point)), [dispatch]);
        const active = useSelector((state) =>
            isActive(state.active, {
                row: -1,
                column: current_column,
            })
        );
        const selected = useSelector((state) => Selection.hasHeaderSelected(state.selected, current_column) || Selection.isEntireTable(state.selected));
        const selectedPoint = useSelector((state) => Selection.getSelectedPoint(state.selected));
        return <ColumnIndicatorComponent {...props} selected={selected} selectedPoint={selectedPoint} onSelect={select} active={active} activate={activate} />;
    };
};

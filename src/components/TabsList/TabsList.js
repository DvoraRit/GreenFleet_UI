import { PropTypes as mobxPropTypes } from "mobx-react"
import PropTypes from 'prop-types';

export default function TabsList({ list, selectedIndex, onSelect, onRemove }) {

    return  (
        <ul className={'tabs-list'}>
            {list.map((t, i) => (
                <li key={t} className={i === selectedIndex ? 'selected' : ''}>
                    <span onClick={() => onSelect(i)}>{t}</span>
                    &nbsp;
                    <i onClick={() => onRemove(t)}>X</i>
                </li>
            ))}
        </ul>
    );
}

TabsList.propTypes = {
    list: mobxPropTypes.arrayOrObservableArray,
    selectedIndex: PropTypes.number,
    onSelect: PropTypes.func,
    onRemove: PropTypes.func,
}
import React from 'react';
import 'flag-icon-css/css/flag-icon.min.css';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';


export const CultureSelector = (props) => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                <span className={'flag-icon flag-icon-' + props.culture.flag}></span>
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem onClick={() => props.changeCulture("de-DE")}>
                    Deutsch
                </DropdownItem>
                <DropdownItem onClick={() => props.changeCulture("sv-SE")}>
                    Svenska
                </DropdownItem>
                <DropdownItem onClick={() => props.changeCulture("en-GB")}>
                    English
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}
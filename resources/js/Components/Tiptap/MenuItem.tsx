import './MenuItem.scss';

import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import classNames from 'classnames';
import { useDetectClickOutside } from 'react-detect-click-outside';

export interface MenuProps {
  icon?: string;
  title?: string;
  renderTitle?: () => JSX.Element | null;
  action?: () => void;
  isActive?: () => boolean;
  respectEditable?: boolean;
  subMenu?: MenuProps[];
  children?: (args: BaseProps) => JSX.Element | null;
}

interface BaseProps {
  editor: Editor | null;
  depth: number;
  shouldShow?: boolean;
  closeMenu?: () => void;
}

export interface Props extends BaseProps {
  menu: MenuProps;
}

interface DropdownProps extends BaseProps {
  submenu?: MenuProps[];
  children?: (args: BaseProps) => JSX.Element | null;
}

const Dropdown = React.forwardRef<HTMLUListElement, DropdownProps>(
  (props, ref) => {
    let {
      submenu,
      shouldShow,
      depth,
      editor,
      children: Children,
      closeMenu,
    } = props;

    depth = depth + 1;
    return (
      <ul
        ref={ref}
        className={classNames('dropdown', {
          show: shouldShow,
          'dropdown-submenu': depth > 1,
        })}
      >
        {submenu != null ? (
          submenu.map((submenu, index) => {
            return (
              <li key={index}>
                <MenuItem
                  editor={editor}
                  depth={depth}
                  menu={submenu}
                  shouldShow={shouldShow}
                  closeMenu={closeMenu}
                />
              </li>
            );
          })
        ) : Children != null ? (
          <li key={0} className="custom-children">
            <Children {...props} />
          </li>
        ) : null}
        {}
      </ul>
    );
  },
);

export default function MenuItem(props: Props) {
  let { menu, depth, editor, shouldShow, closeMenu } = props;
  let {
    icon,
    action,
    title,
    isActive,
    respectEditable,
    subMenu,
    children,
    renderTitle: RenderTitle,
  } = menu;
  const canClick = editor?.isEditable == true || respectEditable == false;

  if (subMenu != null || children != null) {
    const [dropdown, setDropdown] = useState(false);

    closeMenu =
      closeMenu ??
      function () {
        setDropdown(false);
      };

    React.useEffect(() => {
      if (shouldShow == false) {
        setDropdown(shouldShow);
      }
    }, [shouldShow]);

    let ref = useDetectClickOutside({
      onTriggered: () => {
        setDropdown(false);
      },
    });

    return (
      <div ref={ref}>
        <button
          aria-expanded={dropdown ? 'true' : 'false'}
          onClick={() => setDropdown(prev => !prev)}
          style={{ verticalAlign: 'middle' }}
          type="button"
          className={classNames('menu-dropdown', {
            'is-active': isActive && isActive(),
            hidden: !canClick,
          })}
        >
          {title}
          {depth > 0 ? (
            <span>&raquo;</span>
          ) : (
            <i className="ri-arrow-drop-down-line" />
          )}
        </button>
        {dropdown ? (
          <Dropdown
            editor={editor}
            depth={depth}
            submenu={subMenu}
            shouldShow={dropdown}
            children={children}
            closeMenu={closeMenu}
          />
        ) : null}
      </div>
    );
  } else {
    return (
      <button
        type="button"
        className={classNames('menu-item', {
          'is-active': isActive && isActive(),
          hidden: !canClick,
        })}
        onClick={() => {
          action?.call(null);
          closeMenu?.call(null);
        }}
        title={title}
        disabled={!canClick}
      >
        {RenderTitle != null ? (
          <RenderTitle />
        ) : depth > 0 ? (
          <>{title ? `${title} ` : ''}</>
        ) : icon == null ? (
          <>{title}</>
        ) : (
          <>
            <i className={`ri-${icon}`} />
          </>
        )}
      </button>
    );
  }
}

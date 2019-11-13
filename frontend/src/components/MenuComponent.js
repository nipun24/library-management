import React from "react";
import { Menu, MenuItem, IconButton } from "@material-ui/core";

class MenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null
    };
  }

  onMenuClose = (item, e) => {
    if (typeof e.target !== "undefined") {
      this.props.selected({
        data: e.target.getAttribute("value"),
        selected: item
      });
    }
    this.setState({ openMenu: null });
  };

  render() {
    const { data, menuItems, className } = this.props;
    const Icon = this.props.icon;
    return (
      <div>
        <IconButton
          className={className}
          onClick={e => this.setState({ openMenu: e.currentTarget })}
        >
          <Icon />
        </IconButton>
        <Menu
          anchorEl={this.state.openMenu}
          keepMounted
          open={Boolean(this.state.openMenu)}
          onClose={this.onMenuClose}
        >
          {menuItems.map((item, i) => {
            return (
              <MenuItem
                key={i}
                onClick={e => this.onMenuClose(item, e)}
                value={data}
              >
                {item}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}

export default MenuComponent;

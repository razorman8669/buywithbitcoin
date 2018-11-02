import React, {Component} from 'react';
import {connect} from 'react-redux';
import { removeItemFromCart } from '../../../../../event/src/actions';

class CartItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHud: true
    };
    this.hoverState = this.hoverState.bind(this);
    this.unHoverState = this.unHoverState.bind(this);
    this.decrementProduct = this.decrementProduct.bind(this);
  }
  
  hoverState() {
    // this.setState({ showHud: true });
  }
  
  unHoverState() {
    // this.setState({ showHud: true });
  }
  
  async cartUpdate(asin) {
    const { token, username, dispatch } = this.props;
    const body = {
      country: 'US',
      name: 'Cart',
      id: 1,
      items: this.decrementProduct(asin)
    };
    await dispatch(removeItemFromCart(token, username, body));
  }
  
  decrementProduct(asin) {
    let needsRemoval;
    let cart = this.props.cart.map((item, index) => {
      if (item.asin === asin) {
        item.quantity -= 1;
      }
      if (item.quantity <= 0) {
        needsRemoval = index;
      }
      return item;
    });
    
    if (needsRemoval >= 0) {
      cart.splice(needsRemoval, 1);
    }
    
    return cart;
  }

  render() {
    console.log('I am rendering now.');
    const { item } = this.props;
    const productLink = `https://www.amazon.com/gp/product/${item.asin}`;
    const itemImage = (item.images && item.images.small) ? item.images.small: '#';
    return (
      <div className="row product"
           onMouseEnter={this.hoverState}
           onMouseLeave={this.unHoverState} >
        <div className="col-3">
          <span>{item.quantity}</span>
          <img src={itemImage} />
        </div>
        <div className="col-9">
          <a target="_blank" href={productLink}>{item.name}</a>
        </div>
        { this.state.showHud &&
          <div className="product-actions">
            <span onClick={() => { this.cartUpdate(item.asin) }}>
              X
            </span>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    count: state.count,
    token: state.token,
    username: state.user.name,
    cart: state.items
  };
};

export default connect(mapStateToProps)(CartItem);

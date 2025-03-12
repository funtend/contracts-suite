// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;

//////////////////////////////////////////////////////////////////////////////////////
// @title   Funtend
// @notice  More at: https://funtend.xyz
// @version 1.2.0
// @author  MOKA Land
//////////////////////////////////////////////////////////////////////////////////////
//
//   ____  __  __  _  _  ____  ____  _  _  ____
//  ( ___)(  )(  )( \( )(_  _)( ___)( \( )(  _ \
//   )__)  )(__)(  )  (   )(   )__)  )  (  )(_) )
//  (__)  (______)(_)\_) (__) (____)(_)\_)(____/
//
//////////////////////////////////////////////////////////////////////////////////////

import "./CanvasAccessControl.sol";
import "./CanvasFulfillment.sol";
import "./PreRollCollection.sol";
import "./PreRollNFT.sol";
import "./CustomCompositeNFT.sol";
import "./CanvasChildFGO.sol";
import "./CanvasParentFGO.sol";
import "./CanvasOracle.sol";
import "./CanvasPayment.sol";
import "./CanvasPKPs.sol";

library MarketParamsLibrary {
  struct MarketParams {
    uint256[] preRollIds;
    uint256[] preRollAmounts;
    uint256[] preRollIndexes;
    uint256[] customIds;
    uint256[] customAmounts;
    uint256[] customIndexes;
    string[] customURIs;
    string fulfillmentDetails;
    string pkpTokenId;
    address chosenTokenAddress;
    bool sinPKP;
  }
  struct ContractAddresses {
    PreRollCollection preRollCollection;
    PreRollNFT preRollNFT;
    CanvasPKPs canvasPKPs;
    CanvasPayment canvasPayment;
    CanvasOracle oracle;
    CanvasAccessControl accessControl;
    CanvasFulfillment canvasFulfillment;
    CustomCompositeNFT customCompositeNFT;
    CanvasChildFGO childFGO;
    CanvasParentFGO parentFGO;
    address pkpAddress;
  }
}

contract CanvasMarket {
  PreRollCollection private _preRollCollection;
  PreRollNFT private _preRollNFT;
  CanvasPayment private _canvasPayment;
  CanvasPKPs private _canvasPKPs;
  CanvasOracle private _oracle;
  CanvasAccessControl private _accessControl;
  CanvasFulfillment private _canvasFulfillment;
  CustomCompositeNFT private _customCompositeNFT;
  CanvasChildFGO private _childFGO;
  CanvasParentFGO private _parentFGO;
  uint256 private _orderSupply;
  uint256 private _subOrderSupply;
  string public symbol;
  string public name;
  address private _pkpAddress;

  struct Order {
    uint256 orderId;
    uint256 timestamp;
    uint256[] subOrderIds;
    string details;
    string[] message;
    address buyer;
    address chosenAddress;
  }

  struct SubOrder {
    uint256 subOrderId;
    uint256 orderId;
    uint256 amount;
    uint256 fulfillerId;
    uint256 price;
    uint256[] tokenIds;
    string tokenType;
    string status;
    bool isFulfilled;
  }

  struct OrderData {
    string category;
    uint256 price;
    uint256 fulfillerId;
    uint256[] tokenIds;
  }

  mapping(uint256 => uint256) private _preRollTokensSold;
  mapping(uint256 => uint256[]) private _preRollTokenIdsSold;
  mapping(uint256 => Order) private _orders;
  mapping(uint256 => SubOrder) private _subOrders;
  mapping(string => uint256[]) private _PKPToOrderIds;

  modifier onlyAdmin() {
    require(
      _accessControl.isAdmin(msg.sender),
      "CanvasAccessControl: Only admin can perform this action"
    );
    _;
  }

  modifier onlyFulfiller(uint256 _fulfillerId) {
    require(
      _canvasFulfillment.getFulfillerAddress(_fulfillerId) == msg.sender,
      "CanvasMarket: Only the fulfiller can update this status."
    );
    _;
  }

  modifier fulfillerIncluded(uint256[] memory _subOrderIds) {
    bool isFulfiller = false;
    for (uint256 i = 0; i < _subOrderIds.length; i++) {
      uint256 fulfillerIdForSubOrder = _subOrders[_subOrderIds[i]].fulfillerId;
      if (
        _canvasFulfillment.getFulfillerAddress(fulfillerIdForSubOrder) ==
        msg.sender
      ) {
        isFulfiller = true;
        break;
      }
    }
    require(
      isFulfiller,
      "CanvasMarket: Only the fulfiller can update this status."
    );
    _;
  }

  event AccessControlUpdated(
    address indexed oldAccessControl,
    address indexed newAccessControl,
    address updater
  );
  event OracleUpdated(
    address indexed oldOracle,
    address indexed newOracle,
    address updater
  );
  event PreRollCollectionUpdated(
    address indexed oldPreRollCollection,
    address indexed newPreRollCollection,
    address updater
  );
  event PreRollNFTUpdated(
    address indexed oldPreRollNFT,
    address indexed newPreRollNFT,
    address updater
  );
  event CompositeNFTUpdated(
    address indexed oldCompositeNFT,
    address indexed newCompositeNFT,
    address updater
  );
  event CanvasPaymentUpdated(
    address indexed oldCanvasPayment,
    address indexed newCanvasPayment,
    address updater
  );
  event CanvasPKPsUpdated(
    address indexed oldCanvasPKPs,
    address indexed newCanvasPKPs,
    address updater
  );
  event ChildFGOUpdated(
    address indexed oldChildFGO,
    address indexed newChildFGO,
    address updater
  );
  event ParentFGOUpdated(
    address indexed oldParentFGO,
    address indexed newParentFGO,
    address updater
  );
  event CanvasFulfillmentUpdated(
    address indexed oldCanvasFulfillment,
    address indexed newCanvasFulfillment,
    address updater
  );
  event TokensBought(
    uint256[] preRollIds,
    uint256[] customIds,
    uint256[] preRollAmounts,
    uint256[] customAmounts,
    address chosenTokenAddress,
    uint256[] prices,
    address buyer
  );

  event SubOrderIsFulfilled(
    uint256 indexed subOrderId,
    address fulfillerAddress
  );

  event OrderCreated(
    uint256 orderId,
    uint256[] prices,
    uint256 totalPrice,
    address buyer,
    string fulfillmentInformation,
    bool sinPKP,
    string pkpTokenId
  );
  event UpdateOrderDetails(
    uint256 indexed orderId,
    string newOrderDetails,
    address buyer
  );
  event UpdateOrderMessage(
    uint256 indexed orderId,
    string newMessageDetails,
    address buyer
  );
  event UpdateSubOrderStatus(
    uint256 indexed subOrderId,
    string newSubOrderStatus,
    address buyer
  );
  event PKPAddressUpdated(
    address indexed oldPKPAddress,
    address indexed newPKPAddress,
    address updater
  );

  constructor(
    MarketParamsLibrary.ContractAddresses memory _addresses,
    string memory _symbol,
    string memory _name
  ) {
    _preRollCollection = PreRollCollection(_addresses.preRollCollection);
    _canvasPKPs = CanvasPKPs(_addresses.canvasPKPs);
    _accessControl = CanvasAccessControl(_addresses.accessControl);
    _canvasPayment = CanvasPayment(_addresses.canvasPayment);
    _oracle = CanvasOracle(_addresses.oracle);
    _canvasFulfillment = CanvasFulfillment(_addresses.canvasFulfillment);
    _customCompositeNFT = CustomCompositeNFT(_addresses.customCompositeNFT);
    _childFGO = CanvasChildFGO(_addresses.childFGO);
    _parentFGO = CanvasParentFGO(_addresses.parentFGO);
    _preRollNFT = PreRollNFT(_addresses.preRollNFT);
    symbol = _symbol;
    name = _name;
    _orderSupply = 0;
    _pkpAddress = _addresses.pkpAddress;
  }

  // collectionIds for preRoll and childId for custom
  function buyTokens(MarketParamsLibrary.MarketParams memory params) external {
    if (params.sinPKP == false) {
      require(
        msg.sender == _pkpAddress || _accessControl.isAdmin(msg.sender),
        "CanvasPayment: Only the assigned PKP or Admin can execute the function sinPKP."
      );
      require(
        _canvasPKPs.userExists(params.pkpTokenId),
        "CanvasPKPs: User does not yet have an account."
      );
    }
    require(
      _canvasPayment.checkIfAddressVerified(params.chosenTokenAddress),
      "CanvasPayment: Not a valid chosen payment address."
    );
    require(
      params.customIds.length == params.customAmounts.length &&
        params.customIds.length == params.customURIs.length &&
        params.customAmounts.length == params.customURIs.length &&
        params.preRollIds.length == params.preRollAmounts.length,
      "CanvasMarket: Each token must have an amount."
    );

    uint256 exchangeRate = _oracle.getRateByAddress(params.chosenTokenAddress);

    uint256[] memory _prices = new uint256[](
      params.preRollIds.length + params.customIds.length
    );

    _processPreRollTokens(params, exchangeRate, _prices);

    _processCustomTokens(params, exchangeRate, _prices);

    uint256 _totalPrice = 0;

    for (uint256 i = 0; i < _prices.length; i++) {
      _totalPrice += _prices[i];
    }

    uint256[] memory _subOrderIds = new uint256[](
      params.preRollIds.length + params.customIds.length
    );
    for (
      uint256 i = 0;
      i < params.preRollIds.length + params.customIds.length;
      i++
    ) {
      _subOrderIds[i] = _subOrderSupply - i;
    }

    if (!params.sinPKP) {
      _PKPToOrderIds[params.pkpTokenId].push(_orderSupply);
    }

    _createOrder(
      params.chosenTokenAddress,
      msg.sender,
      _subOrderIds,
      params.fulfillmentDetails
    );

    emit OrderCreated(
      _orderSupply,
      _prices,
      _totalPrice,
      msg.sender,
      params.fulfillmentDetails,
      params.sinPKP,
      params.pkpTokenId
    );

    emit TokensBought(
      params.preRollIds,
      params.customIds,
      params.preRollAmounts,
      params.customAmounts,
      params.chosenTokenAddress,
      _prices,
      msg.sender
    );
  }

  function _processPreRollTokens(
    MarketParamsLibrary.MarketParams memory params,
    uint256 exchangeRate,
    uint256[] memory _prices
  ) internal {
    for (uint256 i = 0; i < params.preRollIds.length; i++) {
      (uint256 price, uint256 fulfillerId) = _preRollCollectionMint(
        params.preRollIds[i],
        exchangeRate,
        params.preRollAmounts[i],
        params.preRollIndexes[i],
        params.chosenTokenAddress
      );
      if (params.sinPKP) {
        _canPurchase(
          params.chosenTokenAddress,
          price * params.preRollAmounts[i]
        );
        address creator = _preRollCollection.getCollectionCreator(
          params.preRollIds[i]
        );
        _transferTokens(
          params.chosenTokenAddress,
          creator,
          msg.sender,
          price * params.preRollAmounts[i],
          fulfillerId
        );
      }

      _preRollCollection.purchaseAndMintToken(
        params.preRollIds[i],
        params.preRollAmounts[i],
        params.preRollIndexes[i],
        msg.sender,
        params.chosenTokenAddress
      );

      uint256[] memory _tokenIds = _preRollCollection.getCollectionTokenIds(
        params.preRollIds[i]
      );

      _preRollTokensSold[params.preRollIds[i]] += params.preRollAmounts[i];

      _preRollTokenIdsSold[params.preRollIds[i]] = _tokenIds;

      uint256[] memory _tokenIdsOrder = new uint256[](params.preRollAmounts[i]);
      for (uint256 j = 0; j < params.preRollAmounts[i]; j++) {
        _tokenIdsOrder[j] = _tokenIds[
          _tokenIds.length - params.preRollAmounts[i] + j
        ];
      }

      _createSubOrder(
        _orderSupply + 1,
        price * params.preRollAmounts[i],
        fulfillerId,
        _tokenIdsOrder,
        params.preRollAmounts[i],
        "preroll"
      );

      _prices[i] = price * params.preRollAmounts[i];
    }
  }

  function _processCustomTokens(
    MarketParamsLibrary.MarketParams memory params,
    uint256 exchangeRate,
    uint256[] memory _prices
  ) internal {
    for (uint256 i = 0; i < params.customIds.length; i++) {
      (uint256 price, uint256 fulfillerId) = _customCompositeMint(
        params.customIds[i],
        params.customIndexes[i],
        exchangeRate,
        params.chosenTokenAddress
      );

      if (params.sinPKP) {
        _canPurchase(
          params.chosenTokenAddress,
          price * params.customAmounts[i]
        );
        address creator = _childFGO.getChildCreator(params.customIds[i]);
        _transferTokens(
          params.chosenTokenAddress,
          creator,
          msg.sender,
          price * params.customAmounts[i],
          fulfillerId
        );
      }

      _customCompositeNFT.mint(
        params.chosenTokenAddress,
        msg.sender,
        price * params.customAmounts[i],
        params.customAmounts[i],
        fulfillerId,
        params.customIds[i],
        params.customURIs[i]
      );

      uint256[] memory idsCustom = new uint256[](1);
      idsCustom[0] = params.customIds[i];

      _createSubOrder(
        _orderSupply + 1,
        price * params.customAmounts[i],
        fulfillerId,
        idsCustom,
        params.customAmounts[i],
        "custom"
      );

      _prices[params.preRollIds.length + i] = price * params.customAmounts[i];
    }
  }

  function _createSubOrder(
    uint256 _orderId,
    uint256 _price,
    uint256 _fulfillerId,
    uint256[] memory _tokenIds,
    uint256 _amount,
    string memory _tokenType
  ) internal {
    _subOrderSupply++;
    SubOrder memory newSubOrder = SubOrder({
      subOrderId: _subOrderSupply,
      tokenIds: _tokenIds,
      amount: _amount,
      orderId: _orderId,
      tokenType: _tokenType,
      price: _price,
      status: "ordered",
      isFulfilled: false,
      fulfillerId: _fulfillerId
    });

    _subOrders[_subOrderSupply] = newSubOrder;
  }

  function _createOrder(
    address _chosenAddress,
    address _buyer,
    uint256[] memory _subOrderIds,
    string memory _fulfillmentDetails
  ) internal {
    _orderSupply++;
    Order memory newOrder = Order({
      orderId: _orderSupply,
      subOrderIds: _subOrderIds,
      details: _fulfillmentDetails,
      buyer: _buyer,
      chosenAddress: _chosenAddress,
      timestamp: block.timestamp,
      message: new string[](0)
    });

    _orders[_orderSupply] = newOrder;
  }

  function _transferTokens(
    address _chosenAddress,
    address _creator,
    address _buyer,
    uint256 _price,
    uint256 _fulfillerId
  ) internal {
    IERC20(_chosenAddress).transferFrom(
      _buyer,
      _creator,
      _price -
        ((_price * (_canvasFulfillment.getFulfillerPercent(_fulfillerId))) /
          100)
    );
    IERC20(_chosenAddress).transferFrom(
      _buyer,
      _canvasFulfillment.getFulfillerAddress(_fulfillerId),
      ((_price * (_canvasFulfillment.getFulfillerPercent(_fulfillerId))) / 100)
    );
  }

  function _preRollCollectionMint(
    uint256 _collectionId,
    uint256 _exchangeRate,
    uint256 _amount,
    uint256 _chosenIndex,
    address _chosenTokenAddress
  ) internal view returns (uint256, uint256) {
    require(
      _preRollCollection.getCollectionTokensMinted(_collectionId) + _amount <
        _preRollCollection.getCollectionAmount(_collectionId),
      "CanvasMarket: No more tokens can be bought from this collection."
    );

    uint256 basePrice = _preRollCollection.getCollectionPrice(_collectionId)[
      _chosenIndex
    ];

    uint256 preRollPrice = _calculateAmount(
      basePrice,
      _exchangeRate,
      _chosenTokenAddress
    );

    if (_preRollCollection.getCollectionDiscount(_collectionId) != 0) {
      preRollPrice =
        preRollPrice -
        ((preRollPrice *
          _preRollCollection.getCollectionDiscount(_collectionId)) / 100);
    }

    uint256 fulfillerId = _preRollCollection.getCollectionFulfillerId(
      _collectionId
    );

    return (preRollPrice, fulfillerId);
  }

  function _customCompositeMint(
    uint256 _childId,
    uint256 _chosenIndex,
    uint256 _exchangeRate,
    address _chosenTokenAddress
  ) internal view returns (uint256, uint256) {
    uint256 parentId = _childFGO.getChildTokenParentId(_childId);
    uint256 parentPrice = _parentFGO.getParentPrice(parentId)[_chosenIndex];
    uint256 basePrice = _childFGO.getChildPrice(_childId) + parentPrice;

    uint256 customPrice = _calculateAmount(
      basePrice,
      _exchangeRate,
      _chosenTokenAddress
    );

    uint256 fulfillerId = _childFGO.getChildFulfillerId(_childId);

    return (customPrice, fulfillerId);
  }

  function _canPurchase(address _chosenAddress, uint256 _price) internal view {
    uint256 allowance = IERC20(_chosenAddress).allowance(
      msg.sender,
      address(this)
    );

    require(
      allowance >= _price,
      "CanvasMarket: Insufficient Approval Allowance."
    );
  }

  function _calculateAmount(
    uint256 _amountInWei,
    uint256 _exchangeRate,
    address _tokenAddress
  ) internal view returns (uint256) {
    require(
      _amountInWei > 0 && _exchangeRate > 0,
      "CanvasMarket: Invalid calculation amounts."
    );
    uint256 tokenAmount = (_amountInWei * (10 ** 18)) / _exchangeRate;
    if (_tokenAddress == _oracle.getDaiAddress()) {
      tokenAmount = tokenAmount / (10 ** 12);
    }
    return tokenAmount;
  }

  function updateAccessControl(
    address _newAccessControlAddress
  ) external onlyAdmin {
    address oldAddress = address(_accessControl);
    _accessControl = CanvasAccessControl(_newAccessControlAddress);
    emit AccessControlUpdated(oldAddress, _newAccessControlAddress, msg.sender);
  }

  function updatePreRollCollection(
    address _newPreRollCollectionAddress
  ) external onlyAdmin {
    address oldAddress = address(_preRollCollection);
    _preRollCollection = PreRollCollection(_newPreRollCollectionAddress);
    emit PreRollCollectionUpdated(
      oldAddress,
      _newPreRollCollectionAddress,
      msg.sender
    );
  }

  function updatePreRollNFT(address _newPreRollNFTAddress) external onlyAdmin {
    address oldAddress = address(_preRollNFT);
    _preRollNFT = PreRollNFT(_newPreRollNFTAddress);
    emit PreRollNFTUpdated(oldAddress, _newPreRollNFTAddress, msg.sender);
  }

  function updateCanvasFulfillment(
    address _newCanvasFulfillmentAddress
  ) external onlyAdmin {
    address oldAddress = address(_canvasFulfillment);
    _canvasFulfillment = CanvasFulfillment(_newCanvasFulfillmentAddress);
    emit CanvasFulfillmentUpdated(
      oldAddress,
      _newCanvasFulfillmentAddress,
      msg.sender
    );
  }

  function updateCompositeNFT(
    address _newCompositeNFTAddress
  ) external onlyAdmin {
    address oldAddress = address(_customCompositeNFT);
    _customCompositeNFT = CustomCompositeNFT(_newCompositeNFTAddress);
    emit CompositeNFTUpdated(oldAddress, _newCompositeNFTAddress, msg.sender);
  }

  function updateOracle(address _newOracleAddress) external onlyAdmin {
    address oldAddress = address(_oracle);
    _oracle = CanvasOracle(_newOracleAddress);
    emit OracleUpdated(oldAddress, _newOracleAddress, msg.sender);
  }

  function updateChildFGO(address _newChildFGOAddress) external onlyAdmin {
    address oldAddress = address(_childFGO);
    _childFGO = CanvasChildFGO(_newChildFGOAddress);
    emit ChildFGOUpdated(oldAddress, _newChildFGOAddress, msg.sender);
  }

  function updateCanvasPayment(
    address _newCanvasPaymentAddress
  ) external onlyAdmin {
    address oldAddress = address(_canvasPayment);
    _canvasPayment = CanvasPayment(_newCanvasPaymentAddress);
    emit CanvasPaymentUpdated(oldAddress, _newCanvasPaymentAddress, msg.sender);
  }

  function updateCanvasPKPs(address _newCanvasPKPs) external onlyAdmin {
    address oldAddress = address(_canvasPKPs);
    _canvasPKPs = CanvasPKPs(_newCanvasPKPs);
    emit CanvasPKPsUpdated(oldAddress, _newCanvasPKPs, msg.sender);
  }

  function updateParentFGO(address _newParentFGOAddress) external onlyAdmin {
    address oldAddress = address(_parentFGO);
    _parentFGO = CanvasParentFGO(_newParentFGOAddress);
    emit ParentFGOUpdated(oldAddress, _newParentFGOAddress, msg.sender);
  }

  function updatePKPAddress(address _newPKPAddress) external onlyAdmin {
    address oldAddress = _pkpAddress;
    _pkpAddress = _newPKPAddress;
    emit PKPAddressUpdated(oldAddress, _newPKPAddress, msg.sender);
  }

  function getCollectionPreRollSoldCount(
    uint256 _collectionId
  ) public view returns (uint256) {
    return _preRollTokensSold[_collectionId];
  }

  function getTokensSoldCollectionPreRoll(
    uint256 _collectionId
  ) public view returns (uint256[] memory) {
    return _preRollTokenIdsSold[_collectionId];
  }

  function getSubOrderTokenIds(
    uint256 _subOrderId
  ) public view returns (uint256[] memory) {
    return _subOrders[_subOrderId].tokenIds;
  }

  function getOrderDetails(
    uint256 _orderId
  ) public view returns (string memory) {
    return _orders[_orderId].details;
  }

  function getOrderMessage(
    uint256 _orderId
  ) public view returns (string[] memory) {
    return _orders[_orderId].message;
  }

  function getOrderBuyer(uint256 _orderId) public view returns (address) {
    return _orders[_orderId].buyer;
  }

  function getOrderChosenAddress(
    uint256 _orderId
  ) public view returns (address) {
    return _orders[_orderId].chosenAddress;
  }

  function getOrderTimestamp(uint256 _orderId) public view returns (uint256) {
    return _orders[_orderId].timestamp;
  }

  function getSubOrderStatus(
    uint256 _subOrderId
  ) public view returns (string memory) {
    return _subOrders[_subOrderId].status;
  }

  function getSubOrderIsFulfilled(
    uint256 _subOrderId
  ) public view returns (bool) {
    return _subOrders[_subOrderId].isFulfilled;
  }

  function getSubOrderFulfillerId(
    uint256 _subOrderId
  ) public view returns (uint256) {
    return _subOrders[_subOrderId].fulfillerId;
  }

  function getSubOrderTokenType(
    uint256 _subOrderId
  ) public view returns (string memory) {
    return _subOrders[_subOrderId].tokenType;
  }

  function getSubOrderOrderId(
    uint256 _subOrderId
  ) public view returns (uint256) {
    return _subOrders[_subOrderId].orderId;
  }

  function getSubOrderAmount(
    uint256 _subOrderId
  ) public view returns (uint256) {
    return _subOrders[_subOrderId].amount;
  }

  function getSubOrderPrice(uint256 _subOrderId) public view returns (uint256) {
    return _subOrders[_subOrderId].price;
  }

  function getOrderSubOrders(
    uint256 _orderId
  ) public view returns (uint256[] memory) {
    return _orders[_orderId].subOrderIds;
  }

  function getOrderSupply() public view returns (uint256) {
    return _orderSupply;
  }

  function getSubOrderSupply() public view returns (uint256) {
    return _subOrderSupply;
  }

  function setSubOrderisFulfilled(
    uint256 _subOrderId
  ) external onlyFulfiller(_subOrders[_subOrderId].fulfillerId) {
    _subOrders[_subOrderId].isFulfilled = true;
    emit SubOrderIsFulfilled(_subOrderId, msg.sender);
  }

  function setSubOrderStatus(
    uint256 _subOrderId,
    string memory _status
  ) external onlyFulfiller(_subOrders[_subOrderId].fulfillerId) {
    _subOrders[_subOrderId].status = _status;
    emit UpdateSubOrderStatus(_subOrderId, _status, msg.sender);
  }

  function setOrderDetails(
    uint256 _orderId,
    string memory _newDetails
  ) external {
    require(
      _orders[_orderId].buyer == msg.sender || _pkpAddress == msg.sender,
      "CanvasMarket: Only the buyer or assigned PKP can update their order details."
    );
    _orders[_orderId].details = _newDetails;
    emit UpdateOrderDetails(_orderId, _newDetails, msg.sender);
  }

  function setOrderMessage(
    uint256 _orderId,
    string memory _newMessage
  ) external fulfillerIncluded(_orders[_orderId].subOrderIds) {
    _orders[_orderId].message.push(_newMessage);
    emit UpdateOrderMessage(_orderId, _newMessage, msg.sender);
  }

  function getAccessControlContract() public view returns (address) {
    return address(_accessControl);
  }

  function getPreRollCollectionContract() public view returns (address) {
    return address(_preRollCollection);
  }

  function getCanvasPKPsContract() public view returns (address) {
    return address(_canvasPKPs);
  }

  function getPreRollNFTContract() public view returns (address) {
    return address(_preRollNFT);
  }

  function getCanvasFulfillmentContract() public view returns (address) {
    return address(_canvasFulfillment);
  }

  function getCompositeNFTContract() public view returns (address) {
    return address(_customCompositeNFT);
  }

  function getOracleContract() public view returns (address) {
    return address(_oracle);
  }

  function getChildFGOContract() public view returns (address) {
    return address(_childFGO);
  }

  function getCanvasPayment() public view returns (address) {
    return address(_canvasPayment);
  }

  function getParentFGOContract() public view returns (address) {
    return address(_parentFGO);
  }

  function getPKPAddress() public view returns (address) {
    return _pkpAddress;
  }

  function getOrdersToPKP(
    string memory _tokenIdPKP
  ) public view returns (uint256[] memory) {
    return _PKPToOrderIds[_tokenIdPKP];
  }
}

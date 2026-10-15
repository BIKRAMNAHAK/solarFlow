class PriceCalculator {
  constructor(price, quantity = 1) {
    this.price = Number(price);
    this.quantity = Number(quantity);
  }

  // Price x quantity
  getSubTotal() {
    return this.price * this.quantity;
  }

  // Discount amount (10 matlab 10%)
  getDiscountAmount(discountPercent = 0) {
    return (this.getSubTotal() * discountPercent) / 100;
  }

  // Discount ke baad price
  getPriceAfterDiscount(discountPercent = 0) {
    return this.getSubTotal() - this.getDiscountAmount(discountPercent);
  }

  // GST amount (discount ke baad wali price par)
  getGstAmount(gstPercent = 0, discountPercent = 0) {
    return (this.getPriceAfterDiscount(discountPercent) * gstPercent) / 100;
  }

  // Final total = discount ke baad price + GST
  getFinalTotal(gstPercent = 0, discountPercent = 0) {
    return (
      this.getPriceAfterDiscount(discountPercent) +
      this.getGstAmount(gstPercent, discountPercent)
    );
  }

  // Pura bill ek object me
  getBill(gstPercent = 0, discountPercent = 0) {
    return {
      subTotal: this.getSubTotal(),
      discount: this.getDiscountAmount(discountPercent),
      afterDiscount: this.getPriceAfterDiscount(discountPercent),
      gst: this.getGstAmount(gstPercent, discountPercent),
      total: this.getFinalTotal(gstPercent, discountPercent),
    };
  }
}

export default PriceCalculator;
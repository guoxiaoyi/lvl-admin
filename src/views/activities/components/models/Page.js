const defaultParams = (type) => {
  return {
    child_good_enabled: false,
    product_required: false,
    is_a: function(str) {
      return ['Page', type].includes(str)
    }

  }
}

export default { defaultParams }

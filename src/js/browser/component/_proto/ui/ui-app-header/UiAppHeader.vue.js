import PrimaryHeader from '/component/_proto/eds/primary-header/PrimaryHeader';
import Navbar from '/component/_proto/uikit/navbar/Navbar.vue';

export default {
  props: ['info'],
  components: {
    'eds': PrimaryHeader,
    'ui-kit': Navbar,
  },
  data () {
    let { info } = this;
    if (!info.ui) { info.ui = window._ui; }
    return {
      className: `ui-menu vertical`,
    }
  }
}

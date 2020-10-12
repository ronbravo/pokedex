import Sidebar from '/component/_proto/eds/sidebar/Sidebar';
import Nav from '/component/_proto/uikit/nav/Nav.vue';

export default {
  props: ['info'],
  components: {
    'eds': Sidebar,
    'ui-kit': Nav,
  },
  data () {
    let { info } = this;
    if (!info.ui) { info.ui = window._ui; }
    return {
      className: `ui-menu vertical`,
    }
  }
}

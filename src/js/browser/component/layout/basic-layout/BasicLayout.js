import UiMenu from '/component/_proto/ui/ui-menu/UiMenu.vue';

export default {
  components: {
    UiMenu
  },
  data() {
    return {
      title: 'Sample',
      sidebar: {
        items: [
          { icon: 'home', label: 'Home' },
          { icon: 'person', label: 'Profile' },
          { icon: 'settings', label: 'Settings' },
        ],
      },
    };
  }
}

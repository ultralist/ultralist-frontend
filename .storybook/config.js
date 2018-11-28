// follow https://github.com/webpack-contrib/webpack-hot-middleware/issues/129#issuecomment-302310001
// echo 100000 | sudo tee /proc/sys/fs/inotify/max_user_watches
// otherwise hot reloading will not work!

import React from 'react'
import { configure } from '@storybook/react';

const req = require.context('../src/', true, /.js$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);

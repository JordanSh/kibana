/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import {
  AppMountParameters,
  CoreSetup,
  CoreStart,
  Plugin,
  DEFAULT_APP_CATEGORIES,
} from '../../../src/core/public';
import {
  BuildSecurityPluginSetup,
  BuildSecurityPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME } from '../common';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { LensPublicStart } from '../../../bazel-kibana/x-pack/plugins/lens/public';

export interface StartDependencies {
  data: DataPublicPluginStart;
  lens: LensPublicStart;
}

export class BuildSecurityPlugin
  implements Plugin<BuildSecurityPluginSetup, BuildSecurityPluginStart> {
  public setup(core: CoreSetup): BuildSecurityPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'buildSecurity',
      title: PLUGIN_NAME,
      category: DEFAULT_APP_CATEGORIES.security,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // eslint-disable-next-line no-console
        console.log('core', await core.getStartServices());

        // Render the application
        // return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
        return renderApp(coreStart, depsStart, params);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('buildSecurity.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): BuildSecurityPluginStart {
    return {};
  }

  public stop() {}
}

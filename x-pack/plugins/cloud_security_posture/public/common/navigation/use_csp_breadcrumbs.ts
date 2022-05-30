/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ChromeBreadcrumb, CoreStart } from '@kbn/core/public';
import { useEffect } from 'react';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { PLUGIN_ID } from '../../../common';
import type { CspNavigationItem } from './types';
import { CLOUD_POSTURE } from './translations';

const getClickableHref = (routeMatch, breadcrumbPath, basePath) => {
  if (routeMatch !== breadcrumbPath) {
    return breadcrumbPath.startsWith('/')
      ? `${basePath}${breadcrumbPath}`
      : `${basePath}/${breadcrumbPath}`;
  }
};

export const useCspBreadcrumbs = (breadcrumbs: CspNavigationItem[]) => {
  const {
    services: {
      chrome: { setBreadcrumbs },
      application: { getUrlForApp },
    },
  } = useKibana<CoreStart>();
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  console.log(location);
  console.log(history);
  console.log(match);

  useEffect(() => {
    const cspPath = getUrlForApp(PLUGIN_ID);
    const additionalBreadCrumbs: ChromeBreadcrumb[] = breadcrumbs.map((breadcrumb) => ({
      text: breadcrumb.name,
      href: getClickableHref(match.path, breadcrumb.path, cspPath),
    }));

    setBreadcrumbs([
      {
        text: CLOUD_POSTURE,
        href: cspPath,
      },
      ...additionalBreadCrumbs,
    ]);
  }, [getUrlForApp, setBreadcrumbs, breadcrumbs]);
};

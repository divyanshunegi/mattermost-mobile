// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import Preferences from '@mm-redux/constants/preferences';

import EphemeralStore from 'app/store/ephemeral_store';
import * as NavigationActions from 'app/actions/navigation';

import ChannelBase from './channel_base';

jest.mock('react-intl');
jest.mock('react-native-vector-icons/MaterialIcons', () => ({
    getImageSource: jest.fn().mockResolvedValue(null),
}));

describe('ChannelBase', () => {
    const channelBaseComponentId = 'component-0';
    const componentIds = ['component-1', 'component-2', 'component-3'];
    const baseProps = {
        actions: {
            getChannelStats: jest.fn(),
            loadChannelsForTeam: jest.fn(),
            markChannelViewedAndRead: jest.fn(),
            recordLoadTime: jest.fn(),
            selectDefaultTeam: jest.fn(),
            selectInitialChannel: jest.fn(),
            resetUnreadMessageCount: jest.fn(),
        },
        componentId: channelBaseComponentId,
        theme: Preferences.THEMES.default,
    };
    const optionsForTheme = (theme) => {
        return {
            topBar: {
                backButton: {
                    color: theme.sidebarHeaderTextColor,
                },
                background: {
                    color: theme.sidebarHeaderBg,
                },
                title: {
                    color: theme.sidebarHeaderTextColor,
                },
                leftButtonColor: theme.sidebarHeaderTextColor,
                rightButtonColor: theme.sidebarHeaderTextColor,
            },
            layout: {
                componentBackgroundColor: theme.centerChannelBg,
            },
        };
    };

    test('should call mergeNavigationOptions on all navigation components when theme changes', () => {
        const mergeNavigationOptions = jest.spyOn(NavigationActions, 'mergeNavigationOptions');

        EphemeralStore.addNavigationComponentId(channelBaseComponentId);
        componentIds.forEach((componentId) => {
            EphemeralStore.addNavigationComponentId(componentId);
        });

        const wrapper = shallow(
            <ChannelBase {...baseProps}/>,
            {context: {intl: {formatMessage: jest.fn()}}},
        );

        expect(mergeNavigationOptions.mock.calls).toEqual([]);
        mergeNavigationOptions.mockClear();

        wrapper.setProps({theme: Preferences.THEMES.mattermostDark});

        const newThemeOptions = optionsForTheme(Preferences.THEMES.mattermostDark);
        expect(mergeNavigationOptions.mock.calls).toEqual([
            [baseProps.componentId, newThemeOptions],
            [componentIds[2], newThemeOptions],
            [componentIds[1], newThemeOptions],
            [componentIds[0], newThemeOptions],
        ]);
    });
});

import * as React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons/lib/esm";
import Icon from "./Icon";
import { useGraphiQLContext } from "api/hooks";
import { SchemaViewer } from 'plugins/graphiql-plugin-raw-schema/RawSchemaViewerPlugin'

type Tab = {
  id: string;
  defaultLabel: string;
  icon: IconType;
};

type SidePanelProps = {
  open: boolean;
  tabs?: Tab[];
  activeTab?: string;
};

const SidePanelWrapper = styled.div<{}>``;

const PanelPane = styled.div`
  width: 100%;
`;

const PanelPaneBody = styled.div`
  margin: ${props => props.theme.spacing}px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  /* padding: 0px ${props => props.theme.spacing}px; */
  padding: 0px;
`;

const PaneTitle = styled.h3`
  margin: 0px;
  margin-bottom: ${props => props.theme.spacing}px;
  padding: ${props => props.theme.spacing * 1.5}px;
  font-weight: normal;
  letter-spacing: 0.1rem;
  background-color: ${props => props.theme.primary};
`;

const TabIcon: React.SFC<{ icon: IconType }> = ({ icon: Icon }) => {
  const IconC = styled(Icon)`
    width: ${props => props.theme.spacing * 4}px;
    height: ${props => props.theme.spacing * 4}px;
    padding: ${props => props.theme.spacing * 1.5}px;
    margin: 0px;
  `;
  return <IconC />;
};

export default function SidePanel(props: SidePanelProps = { open: false }) {
  const ctx = useGraphiQLContext();
  const activeTab: string = ctx.activeTab;
  const activeTabItem = props.tabs && props.tabs.find(({ id }) => id === activeTab);
  if (props.open) {
    return (
      <SidePanelWrapper>
        <IconContainer>
          {props.tabs &&
            props.tabs.map((tab, i) => {
              // @ts-ignore
              const { t } = useTranslation(`tab.${tab.id}`);
              const title = t(tab.defaultLabel)
              return (
                // @ts-ignore
                <Icon
                  tabIndex={i + 1}
                  id={tab.id}
                  key={i}
                  ariaTitle={title}
                  title={title}
                  onClick={() => ctx.setValue("activeTab", tab.id)}
                  onFocus={() => ctx.setValue("activeTab", tab.id)} // for tabbed navigation/etc
                  active={tab.id === activeTab}
                >
                  <TabIcon icon={tab.icon} />
                </Icon>
              );
            })}
        </IconContainer>
        <div>
          {activeTabItem && (
            <PanelPane>
              <PaneTitle>{activeTabItem.defaultLabel}</PaneTitle>
              <PanelPaneBody>
                <SchemaViewer/>
              </PanelPaneBody>
            </PanelPane>
          )}
        </div>
      </SidePanelWrapper>
    );
  } else {
    return <div></div>;
  }
}

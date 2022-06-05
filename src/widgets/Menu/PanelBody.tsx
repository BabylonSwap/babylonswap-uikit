import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { SvgProps } from "../../components/Svg";
import * as IconModule from "./icons";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelProps, PushedProps } from "./types";

interface Props extends PanelProps, PushedProps {
    isMobile: boolean;
}

declare global {
    interface Window {
        ethereum?: any
    }
}

const Icons = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
    const location = useLocation();

    // Close the menu when a user clicks a link on mobile
    const handleClick = isMobile ? () => pushNav(false) : undefined;

    const addTokenToMetamask = () => {
        let tokenAddress = "0xe329102DA0E7E135656CD72CDc983c81f27CB5B6";
        let tokenSymbol = "XBT";
        let tokenDecimals = 18;
        let tokenImage = "https://babylonswap.finance/favicon.ico";

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20", // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <Container>
            <MenuEntry key={"Add Babylon To MetaMask"} isActive={false}>
                <LinkLabel isPushed={isPushed} onClick={() => { addTokenToMetamask() }}>{"Add Babylon To MetaMask"}</LinkLabel>
            </MenuEntry>
            {links.map((entry) => {
                const Icon = Icons[entry.icon];
                const iconElement = <Icon width="24px" mr="8px" />;
                const calloutClass = entry.calloutClass ? entry.calloutClass : undefined;

                if (entry.items) {
                    return (
                        <Accordion
                            key={entry.label}
                            isPushed={isPushed}
                            pushNav={pushNav}
                            icon={iconElement}
                            label={entry.label}
                            initialOpenState={entry.initialOpenState}
                            className={calloutClass}
                        >
                            {isPushed &&
                                entry.items.map((item) => (
                                    <MenuEntry key={item.href} secondary isActive={item.href === location.pathname} onClick={handleClick}>
                                        <MenuLink href={item.href}>{item.label}</MenuLink>
                                    </MenuEntry>
                                ))}
                        </Accordion>
                    );
                }
                return (
                    <MenuEntry key={entry.label} isActive={entry.href === location.pathname} className={calloutClass}>
                        <MenuLink href={entry.href} onClick={handleClick}>
                            {iconElement}
                            <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
                        </MenuLink>
                    </MenuEntry>
                );
            })}
        </Container>
    );
};

export default PanelBody;

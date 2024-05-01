import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

import "./Invoice.css";

import InterSemiBold from "../../../fonts/Inter-Bold.ttf";
import InterRegular from "../../../fonts/Inter-Regular.ttf";

Font.register({ family: "InterRegular", fonts: [{ src: InterRegular, fontWeight: "normal" }] });
Font.register({ family: "InterSemiBold", fonts: [{ src: InterSemiBold, fontWeight: "bold" }] });

const imgSrc = process.env.NODE_ENV === "production" ? "./build/images/cafelogo.png" : "../../../images/cafelogo.png";

const styleNodes = {
    printwrapper: {
        margin: 0,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "75px",
        paddingTop: "50px",
        lineHeight: "32px",
        height: "100%",
        // width: "200px",
    },
    page: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "row",
        padding: "48px",
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    normalText: {
        fontFamily: "InterRegular",
    },
    boldText: {
        fontFamily: "InterSemiBold",
        fontWeight: "bold",
        backgroundColor: "#7dd87d",
    },

    printcolumnLeft: {
        width: "60%",
        marginTop: 160,
        display: "flex",
        flexDirection: "column",
        // border: "1px solid blue",
    },
    printcolumnRight: {
        width: "35%",
        marginLeft: "auto",
        // border: "1px solid red",
    },
    columnLeft: {
        width: "60%",
        marginTop: 130,
        // border: "1px solid blue",
    },
    columnRight: {
        width: "30%",
        marginLeft: "auto",
        // border: "1px solid red",
    },
    image: {
        width: "120px",
        height: "90px",
    },
};

// Create styles
const styles = StyleSheet.create(styleNodes);

// Create Document Component
class InvoicePDF extends React.Component {
    render() {
        const {
            // customerName = "John Doe",
            companyName,
            address,
            invoiceNumber,
            eventType,
            eventDate,
            serviceItems,
            totalNet,
            tax,
            taxAmount,
            eventKeyword,
            peopleNumber,
            totalAfterTax,
            invoiceDate,
        } = this.props;
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.columnLeft}>
                        <Text style={{ fontFamily: "InterRegular", fontSize: "12px", marginBottom: 4 }}>{companyName}</Text>
                        {address.length &&
                            address.map((eachLine, index) => {
                                if (index === 0) {
                                    return (
                                        <Text key={index} style={{ fontFamily: "InterRegular", fontSize: "12px" }}>
                                            {eachLine}
                                        </Text>
                                    );
                                }
                                return (
                                    <Text key={index} style={{ fontFamily: "InterRegular", marginTop: 3, fontSize: "12px" }}>
                                        {eachLine}
                                    </Text>
                                );
                            })}
                        <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginTop: 30, fontSize: "12px" }}>
                            Rechnung Nr: {invoiceNumber}
                        </Text>
                        <Text style={{ fontFamily: "InterRegular", marginTop: 12, fontSize: "12px" }}>
                            {eventType} am {eventDate}
                        </Text>

                        <Text style={{ fontFamily: "InterRegular", marginTop: 4, fontSize: "12px" }}>Personenzahl: {peopleNumber}</Text>
                        {eventKeyword && <Text style={{ fontFamily: "InterRegular", marginTop: 4, fontSize: "12px" }}>{eventKeyword}</Text>}

                        <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginTop: 40, fontSize: "12px" }}>
                            Sehr geehrte Damen und Herren
                        </Text>
                        <Text
                            style={{ fontFamily: "InterRegular", marginTop: 4, fontSize: "12px", whiteSpace: "nowrap", wordBreak: "none" }}
                        >
                            Für o.g. Leistung erlauben wir uns wie folgt zu <br /> berechnen:
                        </Text>

                        <View style={{ display: "flex", marginTop: 40, flexDirection: "row" }}>
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", width: 150, fontSize: "13px" }}>Artikel</Text>
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", width: 60, fontSize: "13px" }}>Anzahl</Text>
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", width: 90, fontSize: "13px" }}>
                                Einzelpreis
                            </Text>
                            <Text
                                style={{ fontFamily: "InterSemiBold", fontWeight: "bold", width: 60, fontSize: "13px", textAlign: "right" }}
                            >
                                Gesamt
                            </Text>
                        </View>

                        {serviceItems.length > 0 &&
                            serviceItems.map((eachServiceItem, index) => {
                                return (
                                    <View key={index} style={{ display: "flex", flexDirection: "row", marginTop: 6 }}>
                                        <Text style={{ fontFamily: "InterRegular", width: 150, fontSize: "12px" }}>
                                            {eachServiceItem.article}
                                        </Text>
                                        <Text style={{ fontFamily: "InterRegular", width: 90, fontSize: "12px", textAlign: "center" }}>
                                            {eachServiceItem.quantity}
                                        </Text>
                                        <Text style={{ fontFamily: "InterRegular", width: 90, fontSize: "12px", textAlign: "center" }}>
                                            {eachServiceItem.price}
                                        </Text>
                                        <Text style={{ fontFamily: "InterRegular", width: 60, fontSize: "12px", textAlign: "right" }}>
                                            {(eachServiceItem.price * eachServiceItem.quantity).toFixed(2)}&nbsp;€
                                        </Text>
                                    </View>
                                );
                            })}

                        <View
                            style={{
                                marginTop: 36,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", fontSize: "12px" }}>Gesamtsumme Netto</Text>
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", fontSize: "12px" }}>{totalNet}&nbsp;€</Text>
                        </View>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: 6,
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Text style={{ fontFamily: "InterRegular", fontSize: "12px" }}>Zzgl. {tax}</Text>
                            <Text style={{ fontFamily: "InterRegular", fontSize: "12px" }}>{taxAmount}&nbsp;€</Text>
                        </View>

                        <View style={{ display: "flex", flexDirection: "row", marginTop: 36, alignItems: "center" }}>
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", fontSize: "12px" }}>Gesamtsumme</Text>
                            <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginLeft: "auto", fontSize: "12px" }}>
                                {totalAfterTax}&nbsp;€
                            </Text>
                        </View>
                        <Text style={{ fontFamily: "InterRegular", fontSize: "12px", marginTop: "auto" }}>
                            Bitte begleichen Sie den Rechnungsbetrag innerhalb von 14 Tagen.
                        </Text>
                    </View>

                    <View style={styles.columnRight}>
                        <Image src={imgSrc} style={styles.image} />
                        <Text style={{ fontFamily: "InterRegular", color: "#b86127", fontSize: 18, marginTop: 30 }}>Cafeteria im HPI</Text>
                        <Text style={{ fontFamily: "InterRegular", fontSize: "12px", marginTop: "6px" }}>Ulf Hansen</Text>

                        <Text style={{ fontFamily: "InterRegular", marginTop: 20, fontSize: "12px" }}>Prof. Dr Helmert Str 2-3</Text>
                        <Text style={{ fontFamily: "InterRegular", fontSize: "12px" }}>14482 Potsdam</Text>

                        <Text style={{ fontFamily: "InterRegular", marginTop: 20, fontSize: "12px" }}>Telefon:</Text>
                        <Text style={{ fontFamily: "InterRegular", fontSize: "12px" }}>+ 49 (331) 5509380</Text>

                        <Text style={{ fontFamily: "InterRegular", marginTop: 20, fontSize: "12px" }}>email:</Text>
                        <Text style={{ fontFamily: "InterRegular", fontSize: "12px" }}>ulf.hansen1@gmx.de</Text>

                        <Text style={{ fontFamily: "InterRegular", marginTop: 20, fontSize: "12px" }}>{invoiceDate}</Text>

                        <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginTop: 40, fontSize: "13px" }}>
                            Kontoverbindung
                        </Text>
                        <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginTop: 6, fontSize: "13px" }}>Ulf Hansen</Text>
                        <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginTop: 6, fontSize: "13px" }}>
                            Berlin Sparkasse
                        </Text>
                        <Text style={{ fontFamily: "InterSemiBold", fontWeight: "bold", marginTop: 6, fontSize: "10px" }}>
                            IBAN: DE 04100500000191034304
                        </Text>

                        <Text style={{ fontFamily: "InterRegular", marginTop: 20, fontSize: "12px" }}>Steuer-Nr 046/227/07166</Text>
                        <Text style={{ fontFamily: "InterRegular", marginTop: 6, fontSize: "12px" }}>SWIFTCODE: BELADEBE</Text>
                    </View>
                </Page>
            </Document>
        );
    }
}

export class PlainHTMLPDF extends React.PureComponent {
    render() {
        const {
            // customerName = "John Doe",
            companyName,
            address,
            invoiceNumber,
            eventType,
            eventDate,
            eventKeyword,
            serviceItems,
            totalNet,
            tax,
            taxAmount,
            totalAfterTax,
            peopleNumber,
            invoiceDate,
        } = this.props;
        return (
            <section style={styles.printwrapper} className="print-pdf-doc">
                <div style={styles.printcolumnLeft}>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>{companyName}</p>
                    {address.length &&
                        address.map((eachLine, index) => {
                            if (index === 0) {
                                return (
                                    <p key={index} style={{ fontFamily: "sans-serif", fontSize: "16px" }}>
                                        {eachLine}
                                    </p>
                                );
                            }
                            return (
                                <p key={index} style={{ fontFamily: "sans-serif", marginTop: 3, fontSize: "16px" }}>
                                    {eachLine}
                                </p>
                            );
                        })}
                    <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginTop: 30, fontSize: "16px" }}>
                        Rechnung Nr: {invoiceNumber}
                    </p>
                    <p style={{ fontFamily: "sans-serif", marginTop: 6, fontSize: "16px" }}>
                        {eventType} am {eventDate}
                    </p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>Personenzahl: {peopleNumber}</p>
                    {eventKeyword && <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>{eventKeyword}</p>}
                    <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginTop: 40, fontSize: "16px" }}>
                        Sehr geehrte Damen und Herren
                    </p>
                    <p style={{ fontFamily: "sans-serif", marginTop: 4, fontSize: "16px" }}>
                        Für o.g. Leistung erlauben wir uns wie folgt zu <br /> berechnen:
                    </p>

                    <div style={{ display: "flex", marginTop: 40, flexDirection: "row" }}>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", width: 150, fontSize: "15px" }}>Artikel</p>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", width: 90, fontSize: "15px" }}>Anzahl</p>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", width: 90, fontSize: "15px" }}>Einzelpreis</p>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", width: 60, fontSize: "15px", textAlign: "right" }}>
                            Gesamt
                        </p>
                    </div>

                    {serviceItems.length > 0 &&
                        serviceItems.map((eachServiceItem, index) => {
                            return (
                                <div key={index} style={{ display: "flex", flexDirection: "row", marginTop: 6 }}>
                                    <p
                                        style={{
                                            fontFamily: "sans-serif",
                                            width: 150,
                                            fontSize: "16px",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {eachServiceItem.article}
                                    </p>
                                    <p style={{ fontFamily: "sans-serif", width: 90, fontSize: "16px", textAlign: "center" }}>
                                        {eachServiceItem.quantity}
                                    </p>
                                    <p style={{ fontFamily: "sans-serif", width: 90, fontSize: "16px", textAlign: "center" }}>
                                        {eachServiceItem.price}
                                    </p>
                                    <p style={{ fontFamily: "sans-serif", width: 60, fontSize: "16px", textAlign: "right" }}>
                                        {(eachServiceItem.price * eachServiceItem.quantity).toFixed(2)}&nbsp;€
                                    </p>
                                </div>
                            );
                        })}

                    <div
                        style={{
                            marginTop: 36,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", fontSize: "16px" }}>Gesamtsumme Netto</p>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", fontSize: "16px" }}>{totalNet}&nbsp;€</p>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            marginTop: 6,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>Zzgl. {tax}</p>
                        <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>{taxAmount}&nbsp;€</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", marginTop: 36, alignItems: "center", marginBottom: "12px" }}>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", fontSize: "16px" }}>Gesamtsumme</p>
                        <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginLeft: "auto", fontSize: "16px" }}>
                            {totalAfterTax}&nbsp;€
                        </p>
                    </div>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px", marginTop: "auto" }}>
                        Bitte begleichen Sie den Rechnungsbetrag innerhalb von 14 Tagen.
                    </p>
                </div>

                <div style={styles.printcolumnRight}>
                    <img
                        src={imgSrc}
                        style={{
                            width: "160px",
                            height: "120px",
                        }}
                        alt="ulfs cafe"
                    />
                    <p style={{ fontFamily: "sans-serif", color: "#b86127", fontSize: 24, marginTop: 40 }}>Cafeteria im HPI</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px", marginTop: "6px" }}>Ulf Hansen</p>

                    <p style={{ fontFamily: "sans-serif", marginTop: 20, fontSize: "16px" }}>Prof. Dr Helmert Str 2-3</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>14482 Potsdam</p>

                    <p style={{ fontFamily: "sans-serif", marginTop: 20, fontSize: "16px" }}>Telefon:</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>+ 49 (331) 5509380</p>

                    <p style={{ fontFamily: "sans-serif", marginTop: 20, fontSize: "16px" }}>email:</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: "16px" }}>ulf.hansen1@gmx.de</p>

                    <p style={{ fontFamily: "sans-serif", marginTop: 20, fontSize: "16px" }}>{invoiceDate}</p>

                    <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginTop: 40, fontSize: "14px" }}>Kontoverbindung</p>
                    <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginTop: 6, fontSize: "14px" }}>Ulf Hansen</p>
                    <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginTop: 6, fontSize: "14px" }}>Berlin Sparkasse</p>
                    <p style={{ fontFamily: "sans-serif", fontWeight: "bold", marginTop: 6, fontSize: "12px" }}>
                        IBAN: DE 04100500000191034304
                    </p>

                    <p style={{ fontFamily: "sans-serif", marginTop: 20, fontSize: "16px" }}>Steuer-Nr 046/227/07166</p>
                    <p style={{ fontFamily: "sans-serif", marginTop: 6, fontSize: "16px" }}>SWIFTCODE: BELADEBE</p>
                </div>
            </section>
        );
    }
}

export default InvoicePDF;

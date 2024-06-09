import React from "react";
import ReactPDF, { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";

import "../../pages/styles/Invoice.css";

import InterSemiBold from "./public/fonts/Inter-Bold.ttf";
import InterRegular from "./public/fonts/Inter-Regular.ttf";

Font.register({ family: "InterRegular", fonts: [{ src: InterRegular, fontWeight: "normal" }] });
Font.register({ family: "InterSemiBold", fonts: [{ src: InterSemiBold, fontWeight: "bold" }] });

const imgSrc = "./cafelogo.png";

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

class InvoicePDF extends React.Component {
    render(props) {
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
// eslint-disable-next-line
export default async (data) => {
    return await ReactPDF.renderToStream(<InvoicePDF {...{ data }} />);
};

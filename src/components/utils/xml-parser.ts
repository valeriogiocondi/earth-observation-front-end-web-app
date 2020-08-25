class XmlParser {

    public getXML(xmlString: string) {

        let parser = new DOMParser();
        return parser.parseFromString(xmlString, "text/xml");
    }

}

// SINGLETON
// Export an instance of the class directly
export const xmlParser = new XmlParser();
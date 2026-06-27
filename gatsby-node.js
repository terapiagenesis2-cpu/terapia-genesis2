const fs = require('fs');
const path = require('path');
const {petalos,interferencias} = require("./static/data");

exports.createPages = async ({ actions }) => {
    const { createPage } = actions;
    const createdPages = [];
    function subPetalos (petalos) {
        petalos.forEach((petalo) => {
            const pagePath = `circulo-base/${petalo.linkName}`
            if (petalo.subPetalos) {
                let context = {linkName: petalo.linkName, title: petalo.title, image: petalo.image, iconCenter: petalo.iconCenter, subPetalos: petalo.subPetalos, noNumber: petalo.noNumbers, titlePage: petalo.titlePage,}
                createPage({
                    path: pagePath, // Define la ruta de la página
                    component: require.resolve('./src/components/templates/PetalosTemplate.js'), // Especifica la plantilla a utilizar
                    context: context,
                });
                createdPages.push(pagePath);
                subPetalos(petalo.subPetalos);
            }
            else {
                createPage({
                    path: pagePath, // Define la ruta de la página
                    component: require.resolve('./src/components/templates/FinalPageTemplate.js'), // Especifica la plantilla a utilizar
                    context: {
                        titleText: petalo.title,
                        titlePage: petalo.titlePage,
                        desc: petalo.text,
                        image: petalo.image,
                        imageBody: petalo.imageBody,
                        separation: petalo.separation,
                        fieldText: petalo.fieldText,
                        linkName: petalo.linkName,
                        tipo: petalo.tipo
                    },
                });
                createdPages.push(pagePath);
            }
        });
    }
    function subPetalosInterferencias(interferencias) {

    interferencias.forEach((petalo) => {

        const pagePath = petalo.linkName;

        if (petalo.subPetalos) {
            

            let context = {
                linkName: petalo.linkName,
                title: petalo.title,
                image: petalo.image,
                iconCenter: petalo.iconCenter,
                subPetalos: petalo.subPetalos,
                noNumber: petalo.noNumbers,
                titlePage: petalo.titlePage,
                tipo: petalo.tipo
            };

            createPage({
                path: pagePath,
                component: require.resolve('./src/components/templates/PetalosTemplate.js'),
                context: context,
            });

            createdPages.push(pagePath);

            subPetalosInterferencias(petalo.subPetalos);

        } else {

            createPage({
                path: pagePath,
                component: require.resolve('./src/components/templates/FinalPageTemplate.js'),
                context: {
                    titleText: petalo.titleText,
                    titlePage: petalo.titlePage,
                    desc: petalo.desc,
                    image: petalo.image,
                    imageBody: petalo.imageBody,
                    separation: petalo.separation,
                    fieldText: petalo.fieldText,
                    linkName: petalo.linkName,
                    action: petalo.action,
                    tipo: petalo.tipo
                },
            });

            createdPages.push(pagePath);
        }

    });

 }
    subPetalos(petalos);
    subPetalosInterferencias(interferencias);

    const createdPagesPath = path.join(__dirname, '../createdPages.json');
    fs.writeFileSync(createdPagesPath, JSON.stringify(createdPages));
}


/**
 * Renderiza e controle componentes do corpo da pagina
 */
import { Template } from 'meteor/templating';
import { NaiveBayes } from '../../../libs/Bayes.js';
import './body.html';

let extractAndPlotResult = () => {
	const text = $("#classifier").val();
	const prob = NaiveBayes.guess(text);
	const w = NaiveBayes.extractWinner(prob);
	$("#resultLabel").val(w.label);
	$("#resultProb").val(w.score);
}

/**
 * Eventos da pagina
 */
Template.bodyapp.events({

	// TODO para apresentar
	"click #spam" : (event) => {

		// limpando classificação anterior
		localStorage.clear();

		NaiveBayes.train("cheap ", "spam");
		NaiveBayes.train("", "not spam");

		extractAndPlotResult();
	},

	"click #language" : (event) => {

		// limpando classificação anterior
		localStorage.clear();

		// Portuguese training
		NaiveBayes.train("Treinamento de ingênuo para podermos verificar qual lingua esta sendo falada não consegue", "portuguese");
		NaiveBayes.train("O Corpus do Português (www.corpusdoportugues.org), site aberto no início de novembro, oferece um meio inédito de esquadrinhar a língua portuguesa. Ele do idioma mostrando a popularidade de palavras ou de frases buscadas entre milhares de textos. ", "portuguese");
		NaiveBayes.train("Rota traçada Aliados do presidente Michel Temer afirmam que ele já dá como favas contadas o voto do ministro Herman Benjamin, do Tribunal Superior Eleitoral, pela cassação da chapa na qual se elegeu como vice de Dilma Rousseff. Os mesmos auxiliares, porém, dizem que o prognóstico não define o fim do governo. Acham que é possível reverter o entendimento de Benjamin no plenário da corte e contam também com a eficácia de recursos endereçados ao Supremo Tribunal Federal.Rota traçada Aliados do presidente Michel Temer afirmam que ele já dá como favas contadas o voto do ministro Herman Benjamin, do Tribunal Superior Eleitoral, pela cassação da chapa na qual se elegeu como vice de Dilma Rousseff. Os mesmos auxiliares, porém, dizem que o prognóstico não define o fim do governo. Acham que é possível reverter o entendimento de Benjamin no plenário da corte e contam também com a eficácia de recursos endereçados ao Supremo Tribunal Federal.", "portuguese");
		NaiveBayes.train("O dia das mulheres foi assunto nos corredores do Congresso. A senadora Simone Tebet (PMDB-MS), por exemplo, narrou aos colegas Eunício Oliveira (PMDB-CE) e Omar Aziz (PSD-AM) um dos mantras de seu marido.", "portuguese");
		NaiveBayes.train("Estamos diante de algo legal", "portuguese");

		// Spanish Training
		NaiveBayes.train("El ex presidente sudafricano, Nelson Mandela, ha sido hospitalizado la tarde del sábado, según confirmó un hospital de Pretoria a CNN. Al parecer se trata de un chequeo médico que ya estaba previsto, relacionado con su avanzada edad, según explicó el portavoz de la presidencia Sudafricana Mac Maharaj.", 'spanish');
		NaiveBayes.train("Trabajadores del Vaticano escalaron al techo de la Capilla Sixtina este sábado para instalar la chimenea de la que saldrá el humo negro o blanco para anunciar el resultado de las votaciones para elegir al nuevo papa.La chimenea es el primer signo visible al público de las preparaciones que se realizan en el interior de la capilla donde los cardenales católicos se reunirán a partir de este martes para el inicio del cónclave.", 'spanish');
		NaiveBayes.train("La Junta Directiva del Consejo Nacional Electoral (CNE) efectuará hoy una sesión extraordinaria para definir la fecha de las elecciones presidenciales, después de que Nicolás Maduro fuera juramentado ayer Viernes presidente de la República por la Asamblea Nacional.", 'spanish');
		NaiveBayes.train(" A 27 metros bajo el agua, la luz se vuelve de un azul profundo y nebuloso. Al salir de la oscuridad, tres bailarinas en tutú blanco estiran las piernas en la cubierta de un buque de guerra hundido. No es una aparición fantasmal, aunque lo parezca, es la primera de una serie de fotografías inolvidables que se muestran en la única galería submarina del mundo.", 'spanish');
		NaiveBayes.train("Uhuru Kenyatta, hijo del líder fundador de Kenia, ganó por estrecho margen las elecciones presidenciales del país africano a pesar de enfrentar cargos de crímenes contra la humanidad por la violencia electoral de hace cinco años. Según anunció el sábado la comisión electoral, Kenyatta logró el 50,07% de los votos. Su principal rival, el primer ministro Raila Odinga, obtuvo 43,31% de los votos, y dijo que reclamará el resultado en los tribunales. La Constitución exige que el 50% más un voto para una victoria absoluta.", 'spanish');

		// English Training
		NaiveBayes.train("One morning in late September 2011, a group of American drones took off from an airstrip the C.I.A. had built in the remote southern expanse of Saudi Arabia. The drones crossed the border into Yemen, and were soon hovering over a group of trucks clustered in a desert patch of Jawf Province, a region of the impoverished country once renowned for breeding Arabian horses.", 'english');
		NaiveBayes.train("Just months ago, demonstrators here and around Egypt were chanting for the end of military rule. But on Saturday, as a court ruling about a soccer riot set off angry mobs, many in the crowd here declared they now believed that a military coup might be the best hope to restore order. Although such calls are hardly universal and there is no threat of an imminent coup, the growing murmurs that military intervention may be the only solution to the collapse of public security can be heard across the country, especially in circles opposed to the Islamists who have dominated post-Mubarak elections. ", 'english');
		NaiveBayes.train(" Syrian rebels released 21 detained United Nations peacekeepers to Jordanian forces on Saturday, ending a standoff that raised new tensions in the region and new questions about the fighters just as the United States and other Western nations were grappling over whether to arm them. The rebels announced the release of the Filipino peacekeepers, and Col. Arnulfo Burgos, a spokesman for the Armed Forces of the Philippines, confirmed it.", 'english');
		NaiveBayes.train(" The 83rd International Motor Show, which opened here last week, features the world premieres of 130 vehicles. These include an unprecedented number of models with seven-figure prices, including the $1.3 million LaFerrari supercar, the $1.15 million McLaren P1, the $1.6 million Koenigsegg Hundra and a trust-fund-busting Lamborghini, the $4 million Veneno. The neighborhood has become so rich that the new Rolls-Royce Wraith, expected to sell for more than $300,000, seemed, in comparison, like a car for the masses.", 'english');
		NaiveBayes.train("David Hallberg, the statuesque balvar star who is a principal dancer at both the storied Bolshoi Balvar of Moscow and American Balvar Theater in New York, is theoretically the type of front-row coup that warrants a fit of camera flashes. But when Mr. Hallberg, 30, showed up at New York Fashion Week last month, for a presentation by the Belgian designer Tim Coppens, he glided into the front row nearly unnoticed, save for a quick chat with Tumblr’s fashion evangelist, Valentine Uhovski, and a warm embrace from David Farber, the executive style editor at WSJ.", 'english');

		extractAndPlotResult();
	},
	"click #satisfaction" : (event) => {

		// limpando classificação anterior
		localStorage.clear();

		// Bom
		NaiveBayes.train("Bom, muito bom", "ok");
		NaiveBayes.train("Obrigado por ajudar-me", "ok");
		NaiveBayes.train("Atendimento rápido e preciso. Parabéns a empresa por colocar o cliente em primeiro lugar.", "ok");


		// Ruim
		NaiveBayes.train("uma bosta, faz direito", "~ok");
		NaiveBayes.train("A culpa é sua","~ok");
		NaiveBayes.train("Hoje (25/01) pela manhã, ao acessar o site Climatempo pelo meu celular, devo ter tocado sem querer em um banner, alguns minutos depois recebo um SMS com a cobrança de 4,99. Fui ver o que tinha acontecido, abri o navegador novamente, vejo uma propaganda e ao voltar a página anterior recebo outra SMS com a mesma cobrança. Não me venham com esse papo de que não há cobrança indevida, o que vocês fazem é falta de caráter. Não tem cabimento eu clicar em uma propagando sem querer e ativarem um serviço inútil e sem minha autorização. Já cancelei esse serviço de vocês e quero meu dinheiro de volta!", "~ok")
		NaiveBayes.train("Venho tentando entrar na minha conta no site para realizar uma compra, mas não estou conseguindo acessar a minha conta (esqueci o e mail e a senha) porém quando solicito uma nova senha, diz que foi enviada uma nova senha para o meu e-mail, mas eu não recebo nenhum e-mail da empresa dando-me a nova senha. Gostaria que isso fosse solucionado o mais rápido possível, para mim poder voltar a comprar.", "~ok");
		extractAndPlotResult();
	},

});

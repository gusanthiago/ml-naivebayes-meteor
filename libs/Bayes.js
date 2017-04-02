/**
 * @author Gustavo Santos <gusanthiagodv@gmail.com>
 * @description Efetuar teorema bayesiano com palavras
 */
class Bayes {

	/**
	 * @param text
	 * @returns {Array}
	 */
	unique(text) {
		let u = {}, a = [];
		for (let i = 0, l = text.length; i < l; ++i) {
			if (u.hasOwnProperty(text[i])) {
				continue;
			}
			a.push(text[i]);
			u[text[i]] = 1;
		}
		return a;
	}

	/**
	 * @param stem
	 * @param label
	 * @returns {string}
	 */
	stemKey(stem, label) {
		return '_Bayes::stem:' + stem + '::label:' + label;
	}

	/**
	 * @param stem
	 * @param label
	 * @returns {string}
	 */
	docCountKey(label) {
		return '_Bayes::docCount:' + label;
	}

	/*
	 * @param stem
	 * @returns {string}
	 */
	stemCountKey(stem) {
		return '_Bayes::stemCount:' + stem;
	}

	/**
	 *
	 * @param text
	 */
	log(text) {
		console.log(text);
	}

	/**
	 * @param text
	 * @returns {*}
	 */
	tokenize(text) {
		text = this.unique(text.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().split(' '));
		return text;
	}

	/**
	 *
	 * @returns {Array.<T>}
	 */
	getLabels() {
		let labels = localStorage.getItem('_Bayes::registeredLabels');
		if (!labels) labels = '';
		return labels.split(',').filter(function (a) {
			return a.length;
		});
	}

	/**
	 *
	 * @param label
	 * @returns {boolean}
	 */
	registerLabel(label) {
		let labels = this.getLabels();
		if (labels.indexOf(label) === -1) {
			labels.push(label);
			localStorage.setItem('_Bayes::registeredLabels', labels.join(','));
		}
		return true;
	}

	/**
	 *
	 * @param stem
	 * @param label
	 * @returns {Number}
	 */
	stemLabelCount(stem, label) {
		let count = parseInt(localStorage.getItem(this.stemKey(stem, label)));
		if (!count) count = 0;
		return count;
	}

	/**
	 *
	 * @param stem
	 * @param label
	 * @returns {number}
	 */
	stemInverseLabelCount(stem, label) {
		let labels = this.getLabels(),
			total = 0;
		for (var i = 0, length = labels.length; i < length; i++) {
			if (labels[i] === label)
				continue;
			total += parseInt(this.stemLabelCount(stem, labels[i]));
		}
		return total;
	}

	/**
	 *
	 * @param stem
	 * @returns {Number}
	 */
	stemTotalCount(stem) {
		let count = parseInt(localStorage.getItem(this.stemCountKey(stem)));
		if (!count) count = 0;
		return count;
	}

	/**
	 *
	 * @param label
	 * @returns {Number}
	 */
	docCount(label) {
		let count = parseInt(localStorage.getItem(this.docCountKey(label)))
		if (!count) count = 0;
		return count;
	}

	/**
	 *
	 * @param label
	 * @returns {number}
	 */
	docInverseCount(label) {
		var labels = this.getLabels(),
			total = 0;
		for (var i = 0, length = labels.length; i < length; i++) {
			if (labels[i] === label)
				continue;
			total += parseInt(this.docCount(labels[i]));
		}
		return total;
	}

	/**
	 *
	 * @param key
	 * @returns {number}
	 */
	increment(key) {
		var count = parseInt(localStorage.getItem(key));
		if (!count) count = 0;
		localStorage.setItem(key, parseInt(count) + 1);
		return count + 1;
	}

	/**
	 *
	 * @param stem
	 * @param label
	 */
	incrementStem(stem, label) {
		this.increment(this.stemCountKey(stem));
		this.increment(this.stemKey(stem, label));
	}

	/**
	 * @param label
	 * @returns {number}
	 */
	incrementDocCount(label) {
		return this.increment(this.docCountKey(label));
	}

	/**
	 * @param text
	 * @param label
	 */
	train(text, label) {
		this.registerLabel(label);
		let words = this.tokenize(text),
			length = words.length;
		for (let i = 0; i < length; i++)
			this.incrementStem(words[i], label);
		this.incrementDocCount(label);
	}

	/**
	 *
	 * @param text
	 * @returns {{}}
	 */
	guess(text) {
		let words = this.tokenize(text);
		let	length = words.length,
			labels = this.getLabels(),
			totalDocCount = 0,
			docCounts = {},
			docInverseCounts = {},
			scores = {},
			labelProbability = {},
			probLabel = 0;

		for (var j = 0; j < labels.length; j++) {
			let label = labels[j];
			docCounts[label] = this.docCount(label);
			docInverseCounts[label] = this.docInverseCount(label);
			totalDocCount += parseInt(docCounts[label]);
		}

		for (var j = 0; j < labels.length; j++) {
			let label = labels[j],
				logSum = 0;
			labelProbability[label] = docCounts[label] / totalDocCount;

			for (let i = 0; i < length; i++) {
				let word = words[i],
					_stemTotalCount = this.stemTotalCount(word);
				if (_stemTotalCount === 0) {
					continue;
				} else {
					let wordProbability = this.stemLabelCount(word, label) / docCounts[label];
					let wordInverseProbability = this.stemInverseLabelCount(word, label) / docInverseCounts[label];
					probLabel = wordProbability / (wordProbability + wordInverseProbability);

					probLabel = ( (1 * 0.5) + (_stemTotalCount * probLabel) ) / ( 1 + _stemTotalCount );
					if (probLabel === 0)
						probLabel = 0.01;
					else if (probLabel === 1)
						probLabel = 0.99;
				}

				logSum += (Math.log(1 - probLabel) - Math.log(probLabel));
				this.log("label : "+label + " | word : " + word + " | prob " + probLabel);
			}
			scores[label] = 1 / ( 1 + Math.exp(logSum) );
		}
		return scores;
	}
	/**
	 *
	 * @param scores
	 * @returns {{label: *, score: number}}
	 */
	extractWinner(scores) {
		let bestScore = 0,
			bestLabel = null;
		for (let label in scores) {
			if (scores[label] > bestScore) {
				bestScore = scores[label];
				bestLabel = label;
			}
		}
		return {label: bestLabel, score: bestScore};
	}


}


// Exportando modulo
export const NaiveBayes = new Bayes();